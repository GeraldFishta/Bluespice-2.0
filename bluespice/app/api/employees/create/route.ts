// app/api/employees/create/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Create Supabase admin client (server-side only!)
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY! // ⚠️ Solo server-side, mai nel client!
);

export async function POST(request: NextRequest) {
    try {
        // Verify user is authenticated
        const authHeader = request.headers.get("authorization");
        if (!authHeader) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const token = authHeader.replace("Bearer ", "");
        const {
            data: { user },
            error: authError,
        } = await supabaseAdmin.auth.getUser(token);

        if (authError || !user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Parse request body
        const body = await request.json();
        const {
            email,
            firstName,
            lastName,
            employeeId,
            salary,
            hourlyRate,
            employmentType,
            department,
            position,
            role,
            hireDate,
        } = body;

        // Validate required fields
        if (!email || !firstName || !lastName || !employeeId || !salary || !employmentType) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        // Step 1: Invite user via email (crea auth user + invia email)
        const { data: authData, error: inviteError } = await supabaseAdmin.auth.admin.inviteUserByEmail(
            email,
            {
                data: {
                    first_name: firstName,
                    last_name: lastName,
                    role: role || "employee",
                },
                redirectTo: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/login`,
            }
        );

        if (inviteError) {
            return NextResponse.json(
                { error: `Failed to invite user: ${inviteError.message}` },
                { status: 400 }
            );
        }

        if (!authData.user) {
            return NextResponse.json(
                { error: "Failed to create auth user" },
                { status: 500 }
            );
        }

        const profileId = authData.user.id;

        // Step 2: Wait a moment for trigger to create profile
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Step 3: Update profile with full info
        const { error: profileError } = await supabaseAdmin
            .from("profiles")
            .update({
                first_name: firstName,
                last_name: lastName,
                email: email,
                department: department || null,
                position: position || null,
                role: role || "employee",
                hire_date: hireDate ? new Date(hireDate).toISOString() : null,
            })
            .eq("id", profileId);

        // If profile doesn't exist, create it manually
        if (profileError) {
            const { error: createProfileError } = await supabaseAdmin
                .from("profiles")
                .insert({
                    id: profileId,
                    email: email,
                    first_name: firstName,
                    last_name: lastName,
                    role: role || "employee",
                    department: department || null,
                    position: position || null,
                    hire_date: hireDate ? new Date(hireDate).toISOString() : null,
                });

            if (createProfileError) {
                // Rollback: delete auth user
                await supabaseAdmin.auth.admin.deleteUser(profileId);
                return NextResponse.json(
                    { error: `Failed to create profile: ${createProfileError.message}` },
                    { status: 500 }
                );
            }
        }

        // Step 4: Create employee record
        const { data: employeeData, error: employeeError } = await supabaseAdmin
            .from("employees")
            .insert({
                profile_id: profileId,
                employee_id: employeeId,
                salary: parseFloat(salary),
                hourly_rate: hourlyRate ? parseFloat(hourlyRate) : null,
                employment_type: employmentType,
                status: "active",
            })
            .select()
            .single();

        if (employeeError) {
            // Rollback: delete auth user
            await supabaseAdmin.auth.admin.deleteUser(profileId);
            return NextResponse.json(
                { error: `Failed to create employee: ${employeeError.message}` },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            data: employeeData,
            message: "Employee invited successfully. They will receive an email to set their password.",
        });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.error("Error creating employee:", error);
        return NextResponse.json(
            { error: error.message || "Internal server error" },
            { status: 500 }
        );
    }
}

