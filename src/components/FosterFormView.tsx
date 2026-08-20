import React, { useState } from 'react';
import { FosterRequest } from '../types';

interface FosterFormViewProps {
  onSubmitFoster: (req: Omit<FosterRequest, 'id' | 'timestamp' | 'status'>) => void;
  onGoBack: () => void;
}

export const FosterFormView: React.FC<FosterFormViewProps> = ({
  onSubmitFoster,
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

    onSubmitFoster({
      petName,
      species,
      reason,
      requesterName: requesterName || 'Tutor Responsável',
      phone: phone || '(11) 98765-4321',
      photoUrl: photoPreview || undefined
    });

    setSubmittedSuccess(true);
  };

  return (
    <main className="flex-grow flex flex-col items-center px-4 md:px-16 py-8 md:py-12 max-w-7xl mx-auto w-full gap-8">
      {/* Header Section */}
      <header className="text-center w-full max-w-3xl flex flex-col gap-2">
        <h1 className="font-['Plus_Jakarta_Sans'] text-3xl sm:text-4xl md:text-5xl font-bold text-[#074469]">
          Adoção e Acolhimento
        </h1>
        <p className="font-['Be_Vietnam_Pro'] text-base md:text-lg text-[#41474e] leading-relaxed">
          Estamos aqui para ajudar a conectar corações. Preencha o formulário adequado à sua necessidade de forma simples e rápida.
        </p>
      </header>

      {/* Form Card */}
      <div className="w-full max-w-3xl mx-auto">
        <section className="bg-white rounded-2xl shadow-sm border border-[#e0e3e5] overflow-hidden flex flex-col">
          {/* Card Header (Mint Green) */}
          <div className="p-5 md:p-6 bg-[#a0efd6] flex items-center gap-3">
            <span className="material-symbols-outlined text-[#196f5b] text-2xl">volunteer_activism</span>
            <h2 className="font-['Plus_Jakarta_Sans'] text-xl md:text-2xl font-bold text-[#196f5b]">
              Solicitação de Acolhimento
            </h2>
          </div>

          {submittedSuccess ? (
            <div className="p-8 md:p-12 text-center flex flex-col items-center gap-4">
              <div className="w-16 h-16 bg-[#a0efd6] rounded-full flex items-center justify-center text-[#196f5b]">
                <span className="material-symbols-outlined text-3xl">check_circle</span>
              </div>
              <h3 className="font-['Plus_Jakarta_Sans'] text-2xl font-bold text-[#074469]">
                Solicitação Enviada com Sucesso!
              </h3>
              <p className="font-['Be_Vietnam_Pro'] text-[#41474e] max-w-md text-sm md:text-base leading-relaxed">
                Nossa equipe e as ONGs parceiras da sua região receberam os dados de <strong>{petName}</strong> e entrarão em contato para orientar as próximas etapas do acolhimento.
              </p>
              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => {
                    setSubmittedSuccess(false);
                    setPetName('');
                    setReason('');
                    setPhotoPreview(null);
                  }}
                  className="bg-[#eceef0] text-[#074469] font-['Be_Vietnam_Pro'] text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-[#e0e3e5] transition-colors"
                >
                  Nova Solicitação
                </button>
                <button
                  onClick={onGoBack}
                  className="bg-[#074469] text-white font-['Be_Vietnam_Pro'] text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-[#2a5c82] transition-colors"
                >
                  Voltar para Início
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="p-6 md:p-8 flex flex-col gap-6">
              <p className="font-['Be_Vietnam_Pro'] text-sm md:text-base text-[#41474e] leading-relaxed">
                Precisa de ajuda para encontrar um novo lar para seu pet? Preencha os dados abaixo com o máximo de detalhes.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Nome do Animal */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="foster-pet-name" className="font-['Be_Vietnam_Pro'] text-xs font-semibold text-[#191c1e]">
                    Nome do Animal *
                  </label>
                  <input
                    id="foster-pet-name"
                    required
                    type="text"
                    value={petName}
                    onChange={(e) => setPetName(e.target.value)}
                    placeholder="Nome do pet"
                    className="w-full bg-[#f2f4f6] border border-[#c1c7cf] rounded-lg px-3.5 py-2.5 focus:border-[#074469] focus:bg-white focus:ring-1 focus:ring-[#074469] outline-none transition-colors font-['Be_Vietnam_Pro'] text-sm text-[#191c1e]"
                  />
                </div>

                {/* Espécie */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="foster-species" className="font-['Be_Vietnam_Pro'] text-xs font-semibold text-[#191c1e]">
                    Espécie *
                  </label>
                  <select
                    id="foster-species"
                    value={species}
                    onChange={(e) => setSpecies(e.target.value)}
                    className="w-full bg-[#f2f4f6] border border-[#c1c7cf] rounded-lg px-3.5 py-2.5 focus:border-[#074469] focus:bg-white focus:ring-1 focus:ring-[#074469] outline-none transition-colors font-['Be_Vietnam_Pro'] text-sm text-[#191c1e] cursor-pointer"
                  >
                    <option value="Cachorro">Cachorro</option>
                    <option value="Gato">Gato</option>
                    <option value="Outro">Outro</option>
                  </select>
                </div>
              </div>

              {/* Informações do Tutor */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="font-['Be_Vietnam_Pro'] text-xs font-semibold text-[#191c1e]">
                    Seu Nome Completo
                  </label>
                  <input
                    type="text"
                    value={requesterName}
                    onChange={(e) => setRequesterName(e.target.value)}
                    placeholder="Ex: Carlos Oliveira"
                    className="w-full bg-[#f2f4f6] border border-[#c1c7cf] rounded-lg px-3.5 py-2.5 focus:border-[#074469] focus:bg-white focus:ring-1 focus:ring-[#074469] outline-none transition-colors font-['Be_Vietnam_Pro'] text-sm text-[#191c1e]"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-['Be_Vietnam_Pro'] text-xs font-semibold text-[#191c1e]">
                    Telefone / WhatsApp para Contato
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="(11) 98765-4321"
                    className="w-full bg-[#f2f4f6] border border-[#c1c7cf] rounded-lg px-3.5 py-2.5 focus:border-[#074469] focus:bg-white focus:ring-1 focus:ring-[#074469] outline-none transition-colors font-['Be_Vietnam_Pro'] text-sm text-[#191c1e]"
                  />
                </div>
              </div>

              {/* Fotos do Pet (Dropzone) */}
              <div className="flex flex-col gap-1.5">
                <label className="font-['Be_Vietnam_Pro'] text-xs font-semibold text-[#191c1e]">
                  Fotos do Pet
                </label>
                <label
                  htmlFor="foster-photo-upload"
                  className="border-2 border-dashed border-[#c1c7cf] rounded-xl p-6 flex flex-col items-center justify-center gap-2 bg-[#f2f4f6] hover:bg-[#eceef0] hover:border-[#074469] transition-colors cursor-pointer relative"
                >
                  <input
                    id="foster-photo-upload"
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
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
                        <br />
                        <span className="text-xs text-[#72787f]">Máx 5MB por foto</span>
                      </span>
                    </>
                  )}
                </label>
              </div>

              {/* Motivo da Doação */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="foster-reason" className="font-['Be_Vietnam_Pro'] text-xs font-semibold text-[#191c1e]">
                  Motivo da Doação / Acolhimento *
                </label>
                <textarea
                  id="foster-reason"
                  required
                  rows={4}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Por favor, explique o motivo da solicitação de acolhimento (ex: mudança, despesas médicas, resgate de rua, etc.)..."
                  className="w-full bg-[#f2f4f6] border border-[#c1c7cf] rounded-lg px-3.5 py-2.5 focus:border-[#074469] focus:bg-white focus:ring-1 focus:ring-[#074469] outline-none transition-colors font-['Be_Vietnam_Pro'] text-sm text-[#191c1e] resize-none"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="mt-2 bg-[#074469] hover:bg-[#2a5c82] text-white font-['Be_Vietnam_Pro'] font-semibold text-sm rounded-xl py-3.5 px-6 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-98"
              >
                <span className="material-symbols-outlined text-lg">send</span>
                <span>Enviar Solicitação</span>
              </button>
            </form>
          )}
        </section>
      </div>
    </main>
  );
};
