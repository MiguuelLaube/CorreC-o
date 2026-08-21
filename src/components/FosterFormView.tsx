import React, { useState } from 'react';
import { FosterRequest } from '../types';

interface FosterFormViewProps {
  onSubmit?: (req: Partial<FosterRequest>) => void;
  onSubmitFoster?: (req: Partial<FosterRequest>) => void;
  onOpenPixModal?: () => void;
  onGoToAdoption?: () => void;
  onGoBack?: () => void;
}

export const FosterFormView: React.FC<FosterFormViewProps> = ({
  onSubmit,
  onSubmitFoster,
  onOpenPixModal,
  onGoToAdoption,
  onGoBack
}) => {
  const [petName, setPetName] = useState('');
  const [species, setSpecies] = useState('Cachorro');
  const [reason, setReason] = useState('');
  const [requesterName, setRequesterName] = useState('');
  const [phone, setPhone] = useState('');
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!petName.trim() || !reason.trim()) return;

    const data: Partial<FosterRequest> = {
      petName,
      species,
      reason,
      requesterName: requesterName || 'Tutor Responsável',
      phone: phone || '(11) 98765-4321',
      photoUrl: photoPreview || undefined
    };

    if (onSubmit) {
      onSubmit(data);
    } else if (onSubmitFoster) {
      onSubmitFoster(data);
    }

    setSubmittedSuccess(true);
  };

  const handleBack = () => {
    if (onGoToAdoption) {
      onGoToAdoption();
    } else if (onGoBack) {
      onGoBack();
    }
  };

  return (
    <main className="flex-grow flex flex-col items-center px-4 sm:px-6 md:px-12 lg:px-16 py-8 sm:py-12 max-w-7xl mx-auto w-full gap-8 font-['Plus_Jakarta_Sans'] text-left">
      {/* Header Section */}
      <header className="text-center w-full max-w-3xl flex flex-col gap-2.5">
        <span className="bg-[#a0efd6]/50 dark:bg-[#5BE29D]/20 text-[#126b57] dark:text-[#5BE29D] border border-[#126b57]/20 dark:border-[#5BE29D]/40 text-xs font-bold uppercase tracking-wider px-3.5 py-1 rounded-full mx-auto shadow-2xs">
          Triagem MatchPet
        </span>
        <h1 className="font-['Plus_Jakarta_Sans'] text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#074469] dark:text-white tracking-tight">
          Adoção e Acolhimento
        </h1>
        <p className="font-['Inter'] text-sm sm:text-base md:text-lg text-[#475569] dark:text-[#cbd5e1] leading-relaxed max-w-2xl mx-auto">
          Estamos aqui para ajudar a conectar corações. Preencha o formulário de acolhimento de forma simples e rápida para triagem com a rede de ONGs parceiras.
        </p>
      </header>

      {/* Form Card */}
      <div className="w-full max-w-2xl">
        <section className="bg-white dark:bg-[#121d28] rounded-3xl p-6 sm:p-10 shadow-xs border border-[#e2e8f0] dark:border-[#1e2c3c] flex flex-col gap-6">
          {submittedSuccess ? (
            <div className="text-center py-10 space-y-4">
              <div className="w-16 h-16 bg-[#a0efd6]/50 dark:bg-[#5BE29D]/20 text-[#126b57] dark:text-[#5BE29D] border border-[#126b57]/20 dark:border-[#5BE29D]/40 rounded-2xl flex items-center justify-center mx-auto shadow-xs">
                <span className="material-symbols-outlined text-3xl">check</span>
              </div>
              <h3 className="font-['Plus_Jakarta_Sans'] text-2xl font-bold text-[#074469] dark:text-white">
                Solicitação Enviada com Sucesso!
              </h3>
              <p className="font-['Inter'] text-sm text-[#475569] dark:text-[#cbd5e1] max-w-md mx-auto leading-relaxed">
                Nossa rede de ONGs e protetores parceiros analisará a solicitação de acolhimento com máxima prioridade.
              </p>
              <div className="pt-4 flex justify-center gap-3">
                <button
                  onClick={() => {
                    setSubmittedSuccess(false);
                    setPetName('');
                    setReason('');
                    setPhotoPreview(null);
                  }}
                  className="bg-[#f1f5f9] dark:bg-[#162230] hover:bg-[#e2e8f0] dark:hover:bg-[#1e2f40] text-[#0f172a] dark:text-[#f1f5f9] font-bold text-xs sm:text-sm py-3 px-5 rounded-xl cursor-pointer transition-colors"
                >
                  Nova Solicitação
                </button>
                <button
                  onClick={handleBack}
                  className="bg-[#074469] dark:bg-[#5BE29D] hover:bg-[#2a5c82] dark:hover:bg-[#48cf8b] text-white dark:text-[#063e2e] font-bold text-xs sm:text-sm py-3 px-5 rounded-xl cursor-pointer transition-colors shadow-xs"
                >
                  Voltar ao Início
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5 font-['Inter']">
              <div className="flex justify-between items-center pb-3 border-b border-[#e2e8f0] dark:border-[#1e2c3c]">
                <h2 className="font-['Plus_Jakarta_Sans'] text-lg sm:text-xl font-bold text-[#074469] dark:text-white">
                  Dados para Acolhimento
                </h2>
                {onOpenPixModal && (
                  <button
                    type="button"
                    onClick={onOpenPixModal}
                    className="text-xs font-bold text-[#126b57] dark:text-[#5BE29D] bg-[#a0efd6]/40 dark:bg-[#5BE29D]/20 hover:bg-[#a0efd6] px-3 py-1 rounded-full cursor-pointer transition-colors"
                  >
                    Apoiar com PIX
                  </button>
                )}
              </div>

              {/* Nome do Pet */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="foster-pet-name" className="text-xs font-bold text-[#0f172a] dark:text-[#f1f5f9]">
                  Nome do Animal (se souber) *
                </label>
                <input
                  id="foster-pet-name"
                  type="text"
                  required
                  value={petName}
                  onChange={(e) => setPetName(e.target.value)}
                  placeholder="Ex: Totó, Branquinho, Sem Nome..."
                  className="w-full bg-[#f8fafc] dark:bg-[#162230] border border-[#cbd5e1] dark:border-[#2b3e52] rounded-xl px-4 py-3 text-sm text-[#0f172a] dark:text-[#f1f5f9] placeholder-[#64748b] dark:placeholder-[#94a3b8] focus:border-[#074469] dark:focus:border-[#5BE29D] outline-none transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Espécie */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="foster-species" className="text-xs font-bold text-[#0f172a] dark:text-[#f1f5f9]">
                    Espécie *
                  </label>
                  <select
                    id="foster-species"
                    value={species}
                    onChange={(e) => setSpecies(e.target.value)}
                    className="w-full bg-[#f8fafc] dark:bg-[#162230] border border-[#cbd5e1] dark:border-[#2b3e52] rounded-xl px-4 py-3 text-sm text-[#0f172a] dark:text-[#f1f5f9] focus:border-[#074469] dark:focus:border-[#5BE29D] outline-none cursor-pointer transition-colors"
                  >
                    <option value="Cachorro">Cachorro</option>
                    <option value="Gato">Gato</option>
                    <option value="Outro">Outro</option>
                  </select>
                </div>

                {/* Telefone / WhatsApp */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="foster-phone" className="text-xs font-bold text-[#0f172a] dark:text-[#f1f5f9]">
                    Seu Telefone / WhatsApp *
                  </label>
                  <input
                    id="foster-phone"
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="(11) 98765-4321"
                    className="w-full bg-[#f8fafc] dark:bg-[#162230] border border-[#cbd5e1] dark:border-[#2b3e52] rounded-xl px-4 py-3 text-sm text-[#0f172a] dark:text-[#f1f5f9] placeholder-[#64748b] dark:placeholder-[#94a3b8] focus:border-[#074469] dark:focus:border-[#5BE29D] outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Upload de Fotos */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-[#0f172a] dark:text-[#f1f5f9]">
                  Fotos do Animal (Opcional)
                </label>
                <label
                  htmlFor="foster-photo-upload"
                  className="border-2 border-dashed border-[#cbd5e1] dark:border-[#2b3e52] hover:border-[#074469] dark:hover:border-[#5BE29D] rounded-2xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer bg-[#f8fafc]/60 dark:bg-[#162230]/60 hover:bg-[#f8fafc] dark:hover:bg-[#162230] transition-colors"
                >
                  <input
                    id="foster-photo-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handlePhotoUpload}
                  />
                  {photoPreview ? (
                    <div className="flex flex-col items-center gap-2">
                      <img
                        src={photoPreview}
                        alt="Preview"
                        className="w-24 h-24 object-cover rounded-xl shadow-xs border border-[#e2e8f0] dark:border-[#1e2c3c]"
                      />
                      <span className="text-xs text-[#126b57] dark:text-[#5BE29D] font-bold">
                        Foto anexada com sucesso (clique para trocar)
                      </span>
                    </div>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-[#64748b] dark:text-[#94a3b8] text-3xl">
                        add_a_photo
                      </span>
                      <span className="text-xs sm:text-sm text-[#475569] dark:text-[#cbd5e1] text-center font-medium">
                        Clique ou arraste fotos aqui
                      </span>
                    </>
                  )}
                </label>
              </div>

              {/* Motivo da Doação */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="foster-reason" className="text-xs font-bold text-[#0f172a] dark:text-[#f1f5f9]">
                  Motivo da Solicitação de Acolhimento *
                </label>
                <textarea
                  id="foster-reason"
                  required
                  rows={4}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Por favor, explique o motivo da solicitação de acolhimento (ex: mudança, despesas médicas, resgate de rua, etc.)..."
                  className="w-full bg-[#f8fafc] dark:bg-[#162230] border border-[#cbd5e1] dark:border-[#2b3e52] rounded-xl px-4 py-3 text-sm text-[#0f172a] dark:text-[#f1f5f9] placeholder-[#64748b] dark:placeholder-[#94a3b8] focus:border-[#074469] dark:focus:border-[#5BE29D] outline-none resize-none transition-colors"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="mt-2 bg-[#074469] dark:bg-[#5BE29D] hover:bg-[#2a5c82] dark:hover:bg-[#48cf8b] text-white dark:text-[#063e2e] font-['Plus_Jakarta_Sans'] font-bold text-sm rounded-2xl py-3.5 px-6 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-xs min-h-[48px]"
              >
                <span className="material-symbols-outlined text-lg">send</span>
                <span>Enviar Solicitação de Triagem</span>
              </button>
            </form>
          )}
        </section>
      </div>
    </main>
  );
};
