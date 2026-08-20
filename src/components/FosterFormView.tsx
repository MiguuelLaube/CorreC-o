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
    <main className="flex-grow flex flex-col items-center px-4 md:px-16 py-8 md:py-12 max-w-7xl mx-auto w-full gap-8">
      {/* Header Section */}
      <header className="text-center w-full max-w-3xl flex flex-col gap-2">
        <span className="bg-[#a0efd6] text-[#126b57] font-['Be_Vietnam_Pro'] text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mx-auto">
          Triagem MatchPet
        </span>
        <h1 className="font-['Plus_Jakarta_Sans'] text-3xl sm:text-4xl md:text-5xl font-bold text-[#074469]">
          Adoção e Acolhimento
        </h1>
        <p className="font-['Be_Vietnam_Pro'] text-base md:text-lg text-[#41474e] leading-relaxed">
          Estamos aqui para ajudar a conectar corações. Preencha o formulário de acolhimento de forma simples e rápida para triagem com a rede de ONGs parceiras.
        </p>
      </header>

      {/* Form Card */}
      <div className="w-full max-w-2xl">
        <section className="bg-white rounded-3xl p-6 md:p-10 shadow-xs border border-[#e0e3e5] flex flex-col gap-6">
          {submittedSuccess ? (
            <div className="text-center py-10 space-y-4">
              <div className="w-16 h-16 bg-[#a0efd6] text-[#126b57] rounded-full flex items-center justify-center mx-auto">
                <span className="material-symbols-outlined text-3xl">check</span>
              </div>
              <h3 className="font-['Plus_Jakarta_Sans'] text-2xl font-bold text-[#074469]">
                Solicitação Enviada com Sucesso!
              </h3>
              <p className="font-['Be_Vietnam_Pro'] text-sm text-[#41474e] max-w-md mx-auto">
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
                  className="bg-[#eceef0] hover:bg-[#e0e3e5] text-[#191c1e] font-['Be_Vietnam_Pro'] text-xs font-semibold py-2.5 px-5 rounded-xl cursor-pointer"
                >
                  Nova Solicitação
                </button>
                <button
                  onClick={handleBack}
                  className="bg-[#074469] hover:bg-[#2a5c82] text-white font-['Be_Vietnam_Pro'] text-xs font-semibold py-2.5 px-5 rounded-xl cursor-pointer"
                >
                  Voltar ao Início
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="flex justify-between items-center pb-3 border-b border-[#e0e3e5]">
                <h2 className="font-['Plus_Jakarta_Sans'] text-xl font-bold text-[#074469]">
                  Dados para Acolhimento
                </h2>
                {onOpenPixModal && (
                  <button
                    type="button"
                    onClick={onOpenPixModal}
                    className="text-xs font-bold text-[#126b57] bg-[#a0efd6]/50 hover:bg-[#a0efd6] px-3 py-1 rounded-full cursor-pointer transition-colors"
                  >
                    Apoiar com PIX
                  </button>
                )}
              </div>

              {/* Nome do Pet */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="foster-pet-name" className="font-['Be_Vietnam_Pro'] text-xs font-semibold text-[#191c1e]">
                  Nome do Animal (se souber) *
                </label>
                <input
                  id="foster-pet-name"
                  type="text"
                  required
                  value={petName}
                  onChange={(e) => setPetName(e.target.value)}
                  placeholder="Ex: Totó, Branquinho, Sem Nome..."
                  className="w-full bg-[#f2f4f6] border border-[#c1c7cf] rounded-xl px-3.5 py-2.5 focus:border-[#074469] focus:bg-white outline-none font-['Be_Vietnam_Pro'] text-sm text-[#191c1e]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Espécie */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="foster-species" className="font-['Be_Vietnam_Pro'] text-xs font-semibold text-[#191c1e]">
                    Espécie *
                  </label>
                  <select
                    id="foster-species"
                    value={species}
                    onChange={(e) => setSpecies(e.target.value)}
                    className="w-full bg-[#f2f4f6] border border-[#c1c7cf] rounded-xl px-3.5 py-2.5 focus:border-[#074469] focus:bg-white outline-none font-['Be_Vietnam_Pro'] text-sm text-[#191c1e] cursor-pointer"
                  >
                    <option value="Cachorro">Cachorro</option>
                    <option value="Gato">Gato</option>
                    <option value="Outro">Outro</option>
                  </select>
                </div>

                {/* Telefone / WhatsApp */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="foster-phone" className="font-['Be_Vietnam_Pro'] text-xs font-semibold text-[#191c1e]">
                    Seu Telefone / WhatsApp *
                  </label>
                  <input
                    id="foster-phone"
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="(11) 98765-4321"
                    className="w-full bg-[#f2f4f6] border border-[#c1c7cf] rounded-xl px-3.5 py-2.5 focus:border-[#074469] focus:bg-white outline-none font-['Be_Vietnam_Pro'] text-sm text-[#191c1e]"
                  />
                </div>
              </div>

              {/* Upload de Fotos */}
              <div className="flex flex-col gap-1.5">
                <label className="font-['Be_Vietnam_Pro'] text-xs font-semibold text-[#191c1e]">
                  Fotos do Animal (Opcional)
                </label>
                <label
                  htmlFor="foster-photo-upload"
                  className="border-2 border-dashed border-[#c1c7cf] hover:border-[#074469] rounded-2xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer bg-[#f2f4f6]/50 hover:bg-[#f2f4f6] transition-colors"
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
                        className="w-24 h-24 object-cover rounded-xl shadow-xs border border-[#e0e3e5]"
                      />
                      <span className="text-xs text-[#126b57] font-semibold">
                        Foto anexada com sucesso (clique para trocar)
                      </span>
                    </div>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-[#72787f] text-3xl">
                        add_a_photo
                      </span>
                      <span className="font-['Be_Vietnam_Pro'] text-sm text-[#41474e] text-center">
                        Clique ou arraste fotos aqui
                      </span>
                    </>
                  )}
                </label>
              </div>

              {/* Motivo da Doação */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="foster-reason" className="font-['Be_Vietnam_Pro'] text-xs font-semibold text-[#191c1e]">
                  Motivo da Solicitação de Acolhimento *
                </label>
                <textarea
                  id="foster-reason"
                  required
                  rows={4}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Por favor, explique o motivo da solicitação de acolhimento (ex: mudança, despesas médicas, resgate de rua, etc.)..."
                  className="w-full bg-[#f2f4f6] border border-[#c1c7cf] rounded-xl px-3.5 py-2.5 focus:border-[#074469] focus:bg-white outline-none font-['Be_Vietnam_Pro'] text-sm text-[#191c1e] resize-none"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="mt-2 bg-[#074469] hover:bg-[#2a5c82] text-white font-['Be_Vietnam_Pro'] font-semibold text-sm rounded-xl py-3.5 px-6 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-sm"
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
