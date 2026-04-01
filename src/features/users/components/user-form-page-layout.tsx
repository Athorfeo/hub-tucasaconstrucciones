"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/shared/components/ui/button"
import { Input } from "@/shared/components/ui/input"
import { Label } from "@/shared/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card"
import { useI18n } from "@/shared/lib/i18n-context"
import { toast } from "sonner"
import { Loader2, Plus, Trash2, Save, UploadCloud, ArrowLeft, Building2, UserRound, Landmark, FileText, CheckCircle2, Eye, RefreshCw, ExternalLink } from "lucide-react"
import { createUserWithAccounts, updateUserWithAccounts, uploadDocument } from "../actions"
import { Bank } from "@/features/banks/types"

export function UserFormPageLayout({ 
  initialData = null, 
  banks = []
}: { 
  initialData?: any | null,
  banks: Bank[]
}) {
  const { t } = useI18n()
  const router = useRouter()
  const [loading, setLoading] = React.useState(false)
  const isEditing = !!initialData

  // General Details State
  const [userType, setUserType] = React.useState((initialData?.user_type || "client").toLowerCase())
  const [name, setName] = React.useState(initialData?.name || "")
  const [documentType, setDocumentType] = React.useState((initialData?.document_type || "CC").toUpperCase())
  const [documentNumber, setDocumentNumber] = React.useState(initialData?.document_number || "")
  const [phone, setPhone] = React.useState(initialData?.phone || "")
  const [email, setEmail] = React.useState(initialData?.email || "")

  // Bank Accounts dynamic array state
  const [accounts, setAccounts] = React.useState<any[]>(initialData?.bank_accounts || [])
  
  // Files states (File objects)
  const [taxFile, setTaxFile] = React.useState<File | null>(null)
  const [idFile, setIdFile] = React.useState<File | null>(null)

  const handleAddAccount = () => {
    setAccounts([...accounts, { bank_id: "", account_type: "SAVINGS", account_number: "", is_primary: accounts.length === 0 }])
  }

  const updateAccount = (index: number, field: string, value: any) => {
    const newArr = [...accounts]
    newArr[index][field] = value
    setAccounts(newArr)
  }

  const removeAccount = (index: number) => {
    setAccounts(accounts.filter((_, i) => i !== index))
  }

  const handleSave = async () => {
    if (!name.trim() || !documentNumber.trim() || !documentType || !userType) {
      toast.error(t("admin.fill_all_fields") || "Please fill all required fields")
      return
    }

    setLoading(true)
    try {
      const userData = {
        user_type: userType,
        name: name.trim().toUpperCase(),
        document_type: documentType,
        document_number: documentNumber.trim(),
        phone: phone.trim() || null,
        email: email.trim() || null
      }

      const safeAccounts = accounts.filter(a => a.bank_id && a.account_number).map(a => ({
        bank_id: a.bank_id,
        account_type: a.account_type,
        account_number: a.account_number,
        is_primary: a.is_primary
      }))

      let savedUser: any

      if (isEditing) {
        await updateUserWithAccounts(initialData.id, userData as any, safeAccounts as any)
        savedUser = { id: initialData.id, ...userData }
      } else {
        savedUser = await createUserWithAccounts(userData as any, safeAccounts as any)
      }

      // Upload files if selected
      if (taxFile) savedUser.tax_document_url = await uploadDocument(savedUser.id, taxFile, 'tax_document_url')
      if (idFile) savedUser.id_document_url = await uploadDocument(savedUser.id, idFile, 'id_document_url')

      toast.success(isEditing ? t("contacts.contact_updated") : t("contacts.contact_added"))
      router.push("/users")
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-10 max-w-7xl mx-auto py-10 animate-in fade-in duration-700 px-4">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <button 
            onClick={() => router.push("/users")}
            className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors mb-4"
          >
            <ArrowLeft className="size-3" /> Volver a {t("contacts.title")}
          </button>
          <h1 className="text-4xl font-black tracking-tighter uppercase flex items-center gap-3">
             {isEditing ? t("contacts.edit") : t("contacts.add")}
          </h1>
          <p className="text-muted-foreground font-bold text-xs uppercase tracking-[0.2em] mt-2">
            Completar perfil de sistema
          </p>
        </div>
        <div className="flex flex-col gap-3 w-full sm:w-auto mt-10 sm:mt-0">
          <Button 
            onClick={handleSave} 
            disabled={loading || !name} 
            className="w-full sm:w-auto rounded-2xl h-14 bg-foreground text-background hover:bg-foreground/90 font-black uppercase tracking-[0.2em] text-[10px] px-12 shadow-3xl transition-all active:scale-[0.98] flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin size-4" /> : <><Save className="size-4" /> {t("common.save")}</>}
          </Button>
          <Button 
            variant="ghost" 
            onClick={() => router.push("/users")} 
            disabled={loading} 
            className="w-full sm:w-auto rounded-2xl h-14 uppercase font-black text-[10px] tracking-[0.2em] hover:bg-muted px-10 flex items-center justify-center"
          >
            {t("common.cancel")}
          </Button>
        </div>
      </div>

      {/* Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: General Info */}
        <div className="lg:col-span-5 space-y-8">
          <Card className="border border-border bg-card/50 rounded-[2.5rem] shadow-xl overflow-hidden">
            <CardHeader className="bg-card border-b border-border py-6 px-8">
              <CardTitle className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground flex items-center gap-3">
                <UserRound className="size-4" />{t("contacts.details")}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="uppercase text-[10px] font-bold tracking-widest text-muted-foreground ml-1 flex items-center gap-2">
                    <span>{t("contacts.type")}</span>
                    <span className="opacity-50 lowercase font-medium italic">({t("common.required")})</span>
                  </Label>
                  <Select value={userType} onValueChange={setUserType}>
                    <SelectTrigger className="rounded-[1.25rem] h-16 bg-muted/40 border-border uppercase font-black text-[10px] tracking-widest px-6 focus:ring-1 focus:ring-foreground transition-all">
                      <SelectValue placeholder={t("admin.select_user_placeholder")}>
                        {userType ? t(`contacts.type_${userType.toLowerCase()}`) : ""}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl bg-popover border border-border p-2 min-w-[var(--radix-select-trigger-width)] shadow-3xl">
                      <SelectItem value="client" className="rounded-xl focus:bg-accent focus:text-accent-foreground font-black uppercase text-[10px] tracking-widest py-4 transition-colors px-6">{t("contacts.type_client")}</SelectItem>
                      <SelectItem value="provider" className="rounded-xl focus:bg-accent focus:text-accent-foreground font-black uppercase text-[10px] tracking-widest py-4 transition-colors px-6">{t("contacts.type_provider")}</SelectItem>
                      <SelectItem value="employee" className="rounded-xl focus:bg-accent focus:text-accent-foreground font-black uppercase text-[10px] tracking-widest py-4 transition-colors px-6">{t("contacts.type_employee")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="uppercase text-[10px] font-bold tracking-widest text-muted-foreground ml-1 flex items-center gap-2">
                    <span>{t("contacts.document")}</span>
                    <span className="opacity-50 lowercase font-medium italic">({t("common.required")})</span>
                  </Label>
                  <Select value={documentType} onValueChange={setDocumentType}>
                    <SelectTrigger className="rounded-[1.25rem] h-16 bg-muted/40 border-border uppercase font-black text-[10px] tracking-widest px-6 focus:ring-1 focus:ring-foreground transition-all">
                      <SelectValue placeholder={t("contacts.document")}>
                        {documentType ? t(`contacts.doc_${documentType.toLowerCase()}`) : ""}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl bg-popover border border-border p-2 min-w-[var(--radix-select-trigger-width)] shadow-3xl">
                      <SelectItem value="CC" className="rounded-xl focus:bg-accent focus:text-accent-foreground font-black uppercase text-[10px] tracking-widest py-4 transition-colors px-6">{t("contacts.doc_cc")}</SelectItem>
                      <SelectItem value="NIT" className="rounded-xl focus:bg-accent focus:text-accent-foreground font-black uppercase text-[10px] tracking-widest py-4 transition-colors px-6">{t("contacts.doc_nit")}</SelectItem>
                      <SelectItem value="CE" className="rounded-xl focus:bg-accent focus:text-accent-foreground font-black uppercase text-[10px] tracking-widest py-4 transition-colors px-6">{t("contacts.doc_ce")}</SelectItem>
                      <SelectItem value="PASSPORT" className="rounded-xl focus:bg-accent focus:text-accent-foreground font-black uppercase text-[10px] tracking-widest py-4 transition-colors px-6">{t("contacts.doc_passport")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="uppercase text-[10px] font-bold tracking-widest text-muted-foreground ml-1 flex items-center gap-2">
                  <span>{t("contacts.document")} #</span>
                  <span className="opacity-50 lowercase font-medium italic">({t("common.required")})</span>
                </Label>
                <Input value={documentNumber} onChange={e => setDocumentNumber(e.target.value)} className="rounded-[1.25rem] h-16 bg-muted/40 border-border font-bold uppercase transition-all px-6 focus-visible:ring-1 focus-visible:ring-foreground" />
              </div>

              <div className="space-y-2">
                <Label className="uppercase text-[10px] font-bold tracking-widest text-muted-foreground ml-1 flex items-center gap-2">
                  <span>{t("contacts.name")}</span>
                  <span className="opacity-50 lowercase font-medium italic">({t("common.required")})</span>
                </Label>
                <Input value={name} onChange={e => setName(e.target.value)} className="rounded-[1.25rem] h-16 bg-muted/40 border-border font-bold uppercase transition-all px-6 focus-visible:ring-1 focus-visible:ring-foreground" />
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <Label className="uppercase text-[10px] font-bold tracking-widest text-muted-foreground ml-1 flex items-center gap-2">
                    <span>{t("contacts.phone")}</span>
                    <span className="opacity-50 lowercase font-medium italic">({t("common.optional")})</span>
                  </Label>
                  <Input value={phone} onChange={e => setPhone(e.target.value)} className="rounded-[1.25rem] h-16 bg-muted/40 border-border font-bold px-6 focus-visible:ring-1 focus-visible:ring-foreground" />
                </div>
                <div className="space-y-2">
                  <Label className="uppercase text-[10px] font-bold tracking-widest text-muted-foreground ml-1 flex items-center gap-2">
                    <span>Email</span>
                    <span className="opacity-50 lowercase font-medium italic">({t("common.optional")})</span>
                  </Label>
                  <Input type="email" value={email} onChange={e => setEmail(e.target.value)} className="rounded-[1.25rem] h-16 bg-muted/40 border-border font-bold lowercase px-6 focus-visible:ring-1 focus-visible:ring-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Bank Accounts & Files */}
        <div className="lg:col-span-7 space-y-8">
          
          <Card className="border border-border bg-card/50 rounded-[2.5rem] shadow-xl overflow-hidden">
            <CardHeader className="bg-card border-b border-border py-6 px-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <CardTitle className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground flex items-center gap-3">
                <Landmark className="size-4" />{t("contacts.banks")}<span key="banks-tag" className="opacity-50 lowercase font-medium italic tracking-widest">({t("common.optional")})</span>
              </CardTitle>
              <Button onClick={handleAddAccount} variant="outline" size="sm" className="rounded-xl h-10 text-[10px] uppercase font-black tracking-widest border-border bg-background hover:bg-muted px-4">
                <Plus className="size-3 mr-2" /> {t("contacts.add_bank_account")}
              </Button>
            </CardHeader>
            <CardContent className="p-8 space-y-4">
              {accounts.map((acc, index) => (
                <div key={index} className="space-y-4 p-6 rounded-3xl border border-border bg-background relative group transition-all hover:border-foreground/20">
                  <button onClick={() => removeAccount(index)} className="absolute top-4 right-4 text-muted-foreground hover:text-red-500 transition-colors bg-muted/50 p-2 rounded-full">
                    <Trash2 className="size-4" />
                  </button>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pr-10">
                    <div className="space-y-2">
                      <Label className="uppercase text-[9px] font-bold tracking-widest text-muted-foreground ml-1">{t("contacts.bank_name")}</Label>
                      <Select value={acc.bank_id} onValueChange={(val) => updateAccount(index, "bank_id", val)}>
                        <SelectTrigger className="rounded-[1.25rem] h-16 bg-muted/40 border-border uppercase font-black text-[10px] tracking-widest px-6 focus:ring-1 focus:ring-foreground transition-all">
                          <SelectValue placeholder={t("banks.bank_name")}>
                            {banks.find(b => b.id === acc.bank_id)?.name}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent className="rounded-2xl bg-popover border border-border p-2 min-w-[var(--radix-select-trigger-width)] shadow-3xl">
                          {banks.map(b => (
                            <SelectItem key={b.id} value={b.id} className="rounded-xl focus:bg-accent focus:text-accent-foreground font-black uppercase text-[10px] tracking-widest py-4 transition-colors px-6">{b.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="uppercase text-[9px] font-bold tracking-widest text-muted-foreground ml-1">{t("contacts.bank_account_type")}</Label>
                      <Select value={acc.account_type} onValueChange={(val) => updateAccount(index, "account_type", val)}>
                        <SelectTrigger className="rounded-[1.25rem] h-16 bg-muted/40 border-border uppercase font-black text-[10px] tracking-widest px-6 focus:ring-1 focus:ring-foreground transition-all">
                          <SelectValue placeholder={t("contacts.bank_account_type")}>
                            {acc.account_type ? t(`contacts.acc_${acc.account_type.toLowerCase()}`) : ""}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent className="rounded-2xl bg-popover border border-border p-2 min-w-[var(--radix-select-trigger-width)] shadow-3xl">
                          <SelectItem value="SAVINGS" className="rounded-xl focus:bg-accent focus:text-accent-foreground font-black uppercase text-[10px] tracking-widest py-4 transition-colors px-6">{t("contacts.acc_savings")}</SelectItem>
                          <SelectItem value="CHECKING" className="rounded-xl focus:bg-accent focus:text-accent-foreground font-black uppercase text-[10px] tracking-widest py-4 transition-colors px-6">{t("contacts.acc_checking")}</SelectItem>
                          <SelectItem value="DIGITAL_WALLET" className="rounded-xl focus:bg-accent focus:text-accent-foreground font-black uppercase text-[10px] tracking-widest py-4 transition-colors px-6">{t("contacts.acc_digital_wallet")}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2 pt-2">
                    <Label className="uppercase text-[9px] font-bold tracking-widest text-muted-foreground ml-1">{t("contacts.bank_account_number")}</Label>
                    <Input value={acc.account_number} onChange={e => updateAccount(index, "account_number", e.target.value)} className="rounded-[1.25rem] h-16 bg-muted/40 border-border font-bold text-sm px-6 focus-visible:ring-1 focus-visible:ring-foreground transition-all" />
                  </div>
                </div>
              ))}
              {accounts.length === 0 && (
                <div className="py-12 flex flex-col items-center justify-center border-2 border-dashed border-border rounded-3xl bg-background/50">
                  <Landmark className="size-8 text-muted-foreground/30 mb-4" />
                  <p className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground px-4 text-center">
                    No hay cuentas asociadas
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border border-border bg-card/50 rounded-[2.5rem] shadow-xl overflow-hidden">
            <CardHeader className="bg-card border-b border-border py-6 px-8 flex flex-row items-center justify-between">
              <CardTitle className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground flex items-center gap-3">
                <UploadCloud className="size-4" />{t("contacts.file_upload")}<span key="files-tag" className="opacity-50 lowercase font-medium italic tracking-widest">({t("common.optional")})</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-3">
                  <div className="flex justify-between items-center">
                     <Label className="uppercase text-[10px] font-black tracking-widest text-foreground">RUT / Tax ID</Label>
                  </div>
                  
                  {initialData?.tax_document_url && !taxFile ? (
                    <div className="group relative flex border-2 border-dashed border-foreground/10 rounded-3xl h-32 overflow-hidden bg-muted/30 transition-all hover:border-foreground/30">
                      {/* Left Side: View */}
                      <a 
                        href={initialData.tax_document_url} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="flex-1 flex flex-col items-center justify-center gap-2 hover:bg-foreground/5 transition-colors border-r border-foreground/10"
                      >
                        <Eye className="size-5 text-foreground/50" />
                        <span className="text-[9px] font-black uppercase tracking-widest text-foreground/60">{t("common.view_current")}</span>
                      </a>
                      
                      {/* Right Side: Change */}
                      <Label 
                        htmlFor="taxFile" 
                        className="flex-1 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-foreground/5 transition-colors"
                      >
                        <RefreshCw className="size-5 text-foreground/50" />
                        <span className="text-[9px] font-black uppercase tracking-widest text-foreground/60">{t("common.replace")}</span>
                      </Label>
                      <input type="file" id="taxFile" accept="image/*,application/pdf" capture="environment" className="hidden" onChange={e => setTaxFile(e.target.files?.[0] || null)} />
                    </div>
                  ) : (
                    <Label 
                      htmlFor="taxFile" 
                      className={`cursor-pointer border-2 border-dashed transition-all rounded-3xl flex flex-col items-center justify-center h-32 group relative
                        ${taxFile ? 'bg-muted border-foreground/30' : 'border-border bg-background hover:border-foreground'}`}
                    >
                      {taxFile ? (
                        <>
                          <FileText className="size-6 mb-2 text-foreground/60" />
                          <span className="text-[10px] font-bold uppercase tracking-widest text-foreground/70 px-4 text-center truncate w-full">
                            {taxFile.name}
                          </span>
                          <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground mt-2">{t("common.click_to_update")}</span>
                        </>
                      ) : (
                        <>
                          <UploadCloud className="size-6 mb-3 text-muted-foreground group-hover:text-foreground transition-colors" />
                          <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground group-hover:text-foreground transition-colors px-4 text-center">
                            Subir PDF o Buscar Archivo
                          </span>
                        </>
                      )}
                      <input type="file" id="taxFile" accept="image/*,application/pdf" capture="environment" className="hidden" onChange={e => setTaxFile(e.target.files?.[0] || null)} />
                    </Label>
                  )}
                </div>

                <div className="flex flex-col gap-3">
                  <div className="flex justify-between items-center">
                     <Label className="uppercase text-[10px] font-black tracking-widest text-foreground">DNI / ID Card</Label>
                  </div>

                  {initialData?.id_document_url && !idFile ? (
                    <div className="group relative flex border-2 border-dashed border-foreground/10 rounded-3xl h-32 overflow-hidden bg-muted/30 transition-all hover:border-foreground/30">
                      {/* Left Side: View */}
                      <a 
                        href={initialData.id_document_url} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="flex-1 flex flex-col items-center justify-center gap-2 hover:bg-foreground/5 transition-colors border-r border-foreground/10"
                      >
                        <Eye className="size-5 text-foreground/50" />
                        <span className="text-[9px] font-black uppercase tracking-widest text-foreground/60">{t("common.view_current")}</span>
                      </a>
                      
                      {/* Right Side: Change */}
                      <Label 
                        htmlFor="idFile" 
                        className="flex-1 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-foreground/5 transition-colors"
                      >
                        <RefreshCw className="size-5 text-foreground/50" />
                        <span className="text-[9px] font-black uppercase tracking-widest text-foreground/60">{t("common.replace")}</span>
                      </Label>
                      <input type="file" id="idFile" accept="image/*,application/pdf" capture="environment" className="hidden" onChange={e => setIdFile(e.target.files?.[0] || null)} />
                    </div>
                  ) : (
                    <Label 
                      htmlFor="idFile" 
                      className={`cursor-pointer border-2 border-dashed transition-all rounded-3xl flex flex-col items-center justify-center h-32 group relative
                        ${idFile ? 'bg-muted border-foreground/30' : 'border-border bg-background hover:border-foreground'}`}
                    >
                      {idFile ? (
                        <>
                          <FileText className="size-6 mb-2 text-foreground/60" />
                          <span className="text-[10px] font-bold uppercase tracking-widest text-foreground/70 px-4 text-center truncate w-full">
                            {idFile.name}
                          </span>
                          <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground mt-2">{t("common.click_to_update")}</span>
                        </>
                      ) : (
                        <>
                          <UploadCloud className="size-6 mb-3 text-muted-foreground group-hover:text-foreground transition-colors" />
                          <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground group-hover:text-foreground transition-colors px-4 text-center">
                            Subir PNG o Tomar Foto
                          </span>
                        </>
                      )}
                      <input type="file" id="idFile" accept="image/*,application/pdf" capture="environment" className="hidden" onChange={e => setIdFile(e.target.files?.[0] || null)} />
                    </Label>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  )
}
