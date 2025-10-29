**Analisi del piano**

## ✅ **Punti di forza:**

1. Sequenza logica: Auth → Navigation → Data → Features
2. Allineato alle regole: Auth layout-based, Registry navigation, SWR+Axios
3. Pragmatico: prima le infrastrutture, poi le feature
4. Scalabile: pattern che funzionano per tutte le entità

## 🔧 **Miglioramenti:**

### **FASE 2 - Aggiungere (dopo SWR+Axios):**

**4.5️⃣ Zustand Stores Setup** 🎯

- `authStore.js` → User, isAuthenticated, role
- `uiStore.js` → Modals, sidebar open/closed, notifications
- **Perché:** serve prima di Employee CRUD (auth state è già usato, UI state serve per modals/forms)

**4.6️⃣ Form System Base (RHF + Yup)** 📝

- Setup React Hook Form + Yup
- Custom `FormField` component (wrapper MUI)
- Error display pattern
- **Perché:** Employee CRUD usa forms, meglio prepararlo prima

**4.7️⃣ Security Utilities Base** 🔒

- Input sanitization utilities (`lib/sanitization.js`)
- JWT validation functions (`lib/jwt-security.js`)
- **Perché:** prima di qualsiasi input user (forms, file upload, etc.)

### **FASE 3 - Prima di Employee CRUD:**

**5.5️⃣ UI Components Base** 🎨

- `LoadingSpinner`, `ErrorBoundary`, `StatusChip`
- **Perché:** Employee list ne ha bisogno subito

## 📋 **Sequenza suggerita (aggiornata):**

```
FASE 1 — Foundation
✅ 1️⃣ Auth + Layout guard
✅ 2️⃣ Registry + Sidebar/Header
✅ 3️⃣ UI Base + Theme (già fatto!)

FASE 2 — Data & DX
✅ 4️⃣ SWR + Axios stack
🆕 4.5️⃣ Zustand Stores (authStore, uiStore)
🆕 4.6️⃣ Form System Base (RHF + Yup)
🆕 4.7️⃣ Security Utilities Base
✅ 5️⃣ Types + Hooks

FASE 3 — Core Feature
🆕 5.5️⃣ UI Components Base (LoadingSpinner, etc.)
✅ 6️⃣ Employee CRUD
✅ 7️⃣ Payroll Periods/Records
✅ 8️⃣ Timesheets
```

## 💡 **Perché questi aggiuntivi:**

1. Zustand → Auth state già usato, UI state serve per modals
2. Forms → Employee form richiede RHF/Yup pronto
3. Security → Input sanitization necessaria prima dei forms
4. UI Components → Employee list usa spinner/error/chip

**In sintesi:** il piano è solido. Aggiungiamo Zustand, Forms e Security nella FASE 2 per avere tutto pronto prima delle feature. Vuoi che aggiorniamo il `begin.md` con questi step?
