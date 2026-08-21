import React, { useState } from 'react';
import { Solicitation, FosterRequest } from '../types';

interface ApplicantDetailsModalProps {
  solicitation?: Solicitation | null;
  foster?: FosterRequest | null;
  onClose: () => void;
  onApproveSolicitation?: (id: string) => void;
  onRejectSolicitation?: (id: string, reason?: string) => void;
  onAcceptFoster?: (id: string) => void;
  onDeclineFoster?: (id: string, reason?: string) => void;
}

export const ApplicantDetailsModal: React.FC<ApplicantDetailsModalProps> = ({
  solicitation,
  foster,
  onClose,
  onApproveSolicitation,
  onRejectSolicitation,
  onAcceptFoster,
  onDeclineFoster
}) => {
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  if (!solicitation && !foster) return null;

  const isSolicitation = Boolean(solicitation);
  const targetId = solicitation?.id || foster?.id || '';
  const name = solicitation?.requesterName || foster?.requesterName || 'Adotante';
  const email = solicitation?.requesterEmail || solicitation?.email || foster?.requesterEmail || 'Não informado';
  const phone = solicitation?.phone || foster?.phone || 'Não informado';
  const petName = solicitation?.petName || foster?.petName || 'Animal';
  const petImage = solicitation?.petImage || foster?.photoUrl;

  const handleConfirmReject = () => {
    if (isSolicitation && onRejectSolicitation) {
      onRejectSolicitation(targetId, rejectReason.trim() || undefined);
    } else if (!isSolicitation && onDeclineFoster) {
      onDeclineFoster(targetId, rejectReason.trim() || undefined);
    }
    onClose();
  };

  const cleanPhone = phone.replace(/\D/g, '');
  const whatsAppLink = cleanPhone ? `https://wa.me/55${cleanPhone}?text=Ol%C3%A1%20${encodeURIComponent(name)},%20sou%20da%20ONG%20sobre%20o%20pet%20${encodeURIComponent(petName)}` : null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 md:p-8 shadow-2xl border border-[#e0e3e5] relative animate-in fade-in zoom-in duration-200 max-h-[92vh] overflow-y-auto font-['Be_Vietnam_Pro']">
        {/* Botão Fechar */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-[#72787f] hover:text-[#191c1e] p-2 rounded-full hover:bg-[#e0e3e5] cursor-pointer transition-colors"
          aria-label="Fechar"
        >
          <span className="material-symbols-outlined">close</span>
        </button>

        {/* Cabeçalho do Candidato */}
        <div className="flex items-center gap-4 pb-4 mb-6 border-b border-[#e0e3e5]">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#074469] text-white flex items-center justify-center text-xl font-bold font-['Plus_Jakarta_Sans'] shadow-xs shrink-0">
            {name.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                isSolicitation ? 'bg-[#cde5ff] text-[#074469]' : 'bg-[#ffdbc9] text-[#6d2f00]'
              }`}>
                {isSolicitation ? `Interesse em Adoção` : `Solicitação de Triagem`}
              </span>
              <span className="text-xs text-[#72787f]">Pet: <strong>{petName}</strong></span>
            </div>
            <h2 className="font-['Plus_Jakarta_Sans'] text-2xl sm:text-3xl font-bold text-[#074469] truncate">
              {name}
            </h2>
          </div>
        </div>

        {/* Dados Pessoais de Contato */}
        <div className="bg-[#f7f9fb] p-5 rounded-2xl border border-[#e0e3e5] mb-6">
          <h3 className="text-xs font-bold text-[#074469] uppercase tracking-wider mb-3 flex items-center gap-1.5 font-['Plus_Jakarta_Sans']">
            <span className="material-symbols-outlined text-sm">badge</span>
            <span>Informações Pessoais do Solicitante</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
            <div>
              <span className="text-[#72787f] block text-[11px] font-semibold">Nome Completo:</span>
              <span className="text-[#191c1e] font-bold">{name}</span>
            </div>

            <div>
              <span className="text-[#72787f] block text-[11px] font-semibold">E-mail:</span>
              <a href={`mailto:${email}`} className="text-[#074469] font-medium hover:underline break-all">
                {email}
              </a>
            </div>

            <div>
              <span className="text-[#72787f] block text-[11px] font-semibold">Telefone / WhatsApp:</span>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[#191c1e] font-bold">{phone}</span>
                {whatsAppLink && (
                  <a
                    href={whatsAppLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 bg-[#126b57] text-white text-[10px] font-bold px-2 py-0.5 rounded-lg hover:bg-[#005141] transition-colors"
                  >
                    <span>WhatsApp</span>
                    <span className="material-symbols-outlined text-xs">chat</span>
                  </a>
                )}
              </div>
            </div>

            <div>
              <span className="text-[#72787f] block text-[11px] font-semibold">Animal de Interesse:</span>
              <span className="text-[#126b57] font-bold">{petName}</span>
            </div>
          </div>
        </div>

        {/* Respostas do Questionário de Adoção (se for Solicitação) */}
        {isSolicitation && (
          <div className="mb-6 space-y-4">
            <h3 className="text-xs font-bold text-[#074469] uppercase tracking-wider flex items-center gap-1.5 font-['Plus_Jakarta_Sans']">
              <span className="material-symbols-outlined text-sm">quiz</span>
              <span>Questionário Completo de Adoção Responsável</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="p-3.5 bg-white rounded-2xl border border-[#e0e3e5] shadow-2xs">
                <span className="text-[#72787f] text-[11px] block font-semibold">1. Tipo de Residência:</span>
                <p className="text-xs sm:text-sm font-bold text-[#074469] mt-0.5">
                  {solicitation?.housingType || 'Casa com quintal seguro'}
                </p>
              </div>

              <div className="p-3.5 bg-white rounded-2xl border border-[#e0e3e5] shadow-2xs">
                <span className="text-[#72787f] text-[11px] block font-semibold">2. Possui outros animais?</span>
                <p className="text-xs sm:text-sm font-bold text-[#191c1e] mt-0.5">
                  {solicitation?.hasOtherPets || 'Sim'}
                </p>
              </div>

              <div className="p-3.5 bg-white rounded-2xl border border-[#e0e3e5] shadow-2xs">
                <span className="text-[#72787f] text-[11px] block font-semibold">3. Há crianças ou idosos no lar?</span>
                <p className="text-xs sm:text-sm font-bold text-[#191c1e] mt-0.5">
                  {solicitation?.hasChildrenOrElderly || 'Sim'}
                </p>
              </div>

              <div className="p-3.5 bg-white rounded-2xl border border-[#e0e3e5] shadow-2xs">
                <span className="text-[#72787f] text-[11px] block font-semibold">4. Horas sozinho por dia:</span>
                <p className="text-xs sm:text-sm font-bold text-[#191c1e] mt-0.5">
                  {solicitation?.hoursAlone || '4h a 8h'}
                </p>
              </div>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-[#e0e3e5] shadow-2xs">
              <span className="text-[#72787f] text-[11px] block font-semibold">5. Preferência de Horário para Visita / Entrevista:</span>
              <p className="text-xs sm:text-sm font-bold text-[#126b57] mt-0.5">
                {solicitation?.visitPreference || solicitation?.dateOrDetails || 'Sábado, 14h às 16h'}
              </p>
            </div>

            {solicitation?.notes && (
              <div className="p-4 bg-[#f7f9fb] rounded-2xl border border-[#e0e3e5]">
                <span className="text-[#72787f] text-[11px] block font-semibold">6. Mensagem de Motivação & Observações:</span>
                <p className="text-xs sm:text-sm text-[#191c1e] mt-1 leading-relaxed whitespace-pre-wrap">
                  {solicitation.notes}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Detalhes do Animal em Triagem (se for Foster) */}
        {!isSolicitation && foster && (
          <div className="mb-6 space-y-4">
            <h3 className="text-xs font-bold text-[#074469] uppercase tracking-wider flex items-center gap-1.5 font-['Plus_Jakarta_Sans']">
              <span className="material-symbols-outlined text-sm">pets</span>
              <span>Informações do Animal Resgatado</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs sm:text-sm">
              <div className="p-3.5 bg-white rounded-2xl border border-[#e0e3e5]">
                <span className="text-[#72787f] text-[11px] block font-semibold">Espécie / Porte:</span>
                <p className="font-bold text-[#074469]">{foster.species} • {foster.size || 'Médio'}</p>
              </div>

              <div className="p-3.5 bg-white rounded-2xl border border-[#e0e3e5]">
                <span className="text-[#72787f] text-[11px] block font-semibold">Data da Solicitação:</span>
                <p className="font-bold text-[#191c1e]">{foster.timestamp}</p>
              </div>
            </div>

            <div className="p-4 bg-[#f7f9fb] rounded-2xl border border-[#e0e3e5]">
              <span className="text-[#72787f] text-[11px] block font-semibold">Motivo do Acolhimento / Histórico:</span>
              <p className="text-xs sm:text-sm text-[#191c1e] mt-1 leading-relaxed">
                {foster.reason}
              </p>
            </div>

            {foster.photoUrl && (
              <div className="mt-3">
                <span className="text-[#72787f] text-[11px] block font-semibold mb-1.5">Foto do Animal:</span>
                <img
                  src={foster.photoUrl}
                  alt={foster.petName}
                  className="w-full max-h-60 object-cover rounded-2xl border border-[#e0e3e5]"
                />
              </div>
            )}
          </div>
        )}

        {/* Formulário Opcional de Motivo de Negação */}
        {showRejectForm ? (
          <div className="bg-[#ffdad6]/40 border border-[#ffdad6] p-4 rounded-2xl mb-6 animate-in fade-in duration-200">
            <h4 className="text-xs font-bold text-[#ba1a1a] mb-1 flex items-center gap-1.5 font-['Plus_Jakarta_Sans']">
              <span className="material-symbols-outlined text-base">warning</span>
              <span>Confirmar Negação do Pedido</span>
            </h4>
            <p className="text-xs text-[#41474e] mb-3">
              O pedido será removido das notificações ativas da sua ONG e o adotante receberá uma notificação informando a recusa.
            </p>

            <textarea
              rows={2}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Motivo da recusa (opcional, ex: perfil residencial incompatível no momento, etc.)"
              className="w-full bg-white border border-[#c1c7cf] rounded-xl p-2.5 text-xs outline-none focus:border-[#ba1a1a] resize-none mb-3"
            />

            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={() => setShowRejectForm(false)}
                className="px-4 py-2 bg-white hover:bg-[#e0e3e5] text-[#41474e] rounded-xl text-xs font-semibold cursor-pointer"
              >
                Voltar
              </button>
              <button
                type="button"
                onClick={handleConfirmReject}
                className="px-5 py-2 bg-[#ba1a1a] hover:bg-[#93000a] text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-xs"
              >
                Confirmar e Negar
              </button>
            </div>
          </div>
        ) : (
          /* Botões de Ação Principais */
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-[#e0e3e5]">
            <button
              onClick={onClose}
              className="sm:w-32 bg-[#f2f4f6] hover:bg-[#e0e3e5] text-[#41474e] font-semibold py-3 rounded-xl text-xs cursor-pointer text-center"
            >
              Fechar
            </button>

            <button
              type="button"
              onClick={() => setShowRejectForm(true)}
              className="flex-1 bg-[#ffdad6] hover:bg-[#ffb4ab] text-[#ba1a1a] font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">cancel</span>
              <span>Negar Pedido</span>
            </button>

            {isSolicitation && onApproveSolicitation && (
              <button
                type="button"
                onClick={() => {
                  onApproveSolicitation(targetId);
                  onClose();
                }}
                className="flex-1 bg-[#126b57] hover:bg-[#005141] text-white font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs cursor-pointer"
              >
                <span className="material-symbols-outlined text-base">check_circle</span>
                <span>Conceder Adoção</span>
              </button>
            )}

            {!isSolicitation && onAcceptFoster && (
              <button
                type="button"
                onClick={() => {
                  onAcceptFoster(targetId);
                  onClose();
                }}
                className="flex-1 bg-[#126b57] hover:bg-[#005141] text-white font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs cursor-pointer"
              >
                <span className="material-symbols-outlined text-base">check_circle</span>
                <span>Aceitar Acolhimento</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
