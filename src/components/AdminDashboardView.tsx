import React, { useState } from 'react';
import { ONG, Pet, Solicitation, Partner } from '../types';
import { authService } from '../services/authService';
import { dbService } from '../services/db';

interface AdminDashboardViewProps {
  ongs: ONG[];
  pets: Pet[];
  solicitations: Solicitation[];
  partners: Partner[];
  onOngCreated: (newOng: ONG) => void;
  onUpdateOng: (updatedOng: ONG) => void;
  onDeleteOng: (ongId: string) => void;
  onPartnerCreated: (newPartner: Partner) => void;
  onUpdatePartner: (updatedPartner: Partner) => void;
  onDeletePartner: (partnerId: string) => void;
}

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({
  ongs,
  pets,
  solicitations,
  partners,
  onOngCreated,
  onUpdateOng,
  onDeleteOng,
  onPartnerCreated,
  onUpdatePartner,
  onDeletePartner
}) => {
  // Aba ativa do Painel Admin
  const [adminTab, setAdminTab] = useState<'ongs' | 'partners'>('ongs');

  // Estados de feedback
  const [loading, setLoading] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // ==========================================
  // ESTADOS - GESTÃO DE ONGS
  // ==========================================
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingOng, setEditingOng] = useState<ONG | null>(null);

  // Form states - Create ONG
  const [cnpj, setCnpj] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('São Paulo');
  const [state, setState] = useState('SP');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');

  // Form states - Edit ONG
  const [editCnpj, setEditCnpj] = useState('');
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPassword, setEditPassword] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editAddress, setEditAddress] = useState('');
  const [editCity, setEditCity] = useState('São Paulo');
  const [editState, setEditState] = useState('SP');
  const [editDescription, setEditDescription] = useState('');
  const [editImage, setEditImage] = useState('');

  // ==========================================
  // ESTADOS - GESTÃO DE PROPAGANDAS & PARCEIROS
  // ==========================================
  const [showCreatePartnerModal, setShowCreatePartnerModal] = useState(false);
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null);

  // Form states - Create Partner
  const [partnerName, setPartnerName] = useState('');
  const [partnerCategory, setPartnerCategory] = useState('Saúde & Emergência');
  const [partnerTagline, setPartnerTagline] = useState('');
  const [partnerImage, setPartnerImage] = useState('');
  const [partnerUrl, setPartnerUrl] = useState('');
  const [partnerBadge, setPartnerBadge] = useState('Parceiro Oficial');
  const [partnerDiscount, setPartnerDiscount] = useState('');

  // Form states - Edit Partner
  const [editPartnerName, setEditPartnerName] = useState('');
  const [editPartnerCategory, setEditPartnerCategory] = useState('');
  const [editPartnerTagline, setEditPartnerTagline] = useState('');
  const [editPartnerImage, setEditPartnerImage] = useState('');
  const [editPartnerUrl, setEditPartnerUrl] = useState('');
  const [editPartnerBadge, setEditPartnerBadge] = useState('');
  const [editPartnerDiscount, setEditPartnerDiscount] = useState('');

  const formatCnpj = (val: string) => {
    return val
      .replace(/\D/g, '')
      .replace(/^(\d{2})(\d)/, '$1.$2')
      .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
      .replace(/\.(\d{3})(\d)/, '.$1/$2')
      .replace(/(\d{4})(\d)/, '$1-$2')
      .slice(0, 18);
  };

  // ------------------------------------------
  // Handlers - ONGs
  // ------------------------------------------
  const handleOpenEdit = (ong: ONG) => {
    setEditingOng(ong);
    setEditCnpj(ong.cnpj || '');
    setEditName(ong.name || '');
    setEditEmail(ong.email || '');
    setEditPassword('');
    setEditPhone(ong.phone || '');
    setEditAddress(ong.address || '');
    setEditCity(ong.city || 'São Paulo');
    setEditState(ong.state || 'SP');
    setEditDescription(ong.description || '');
    setEditImage(ong.image || '');
    setErrorMsg(null);
  };

  const handleCreateOng = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setFeedbackMsg(null);
    setLoading(true);

    try {
      const res = await authService.registerOngByAdmin({
        cnpj,
        name,
        email,
        passwordPlain: password,
        phone,
        address,
        city,
        state,
        description,
        image
      });

      if (!res.success || !res.ong) {
        setErrorMsg(res.error || 'Erro ao cadastrar ONG.');
        setLoading(false);
        return;
      }

      onOngCreated(res.ong);
      setFeedbackMsg(`Conta para a ONG "${res.ong.name}" criada com sucesso! Credenciais ativadas.`);

      // Reset form
      setCnpj('');
      setName('');
      setEmail('');
      setPassword('');
      setPhone('');
      setAddress('');
      setDescription('');
      setImage('');
      setShowCreateModal(false);
    } catch (err: any) {
      setErrorMsg(err?.message || 'Falha ao processar cadastro de ONG.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveEditOng = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingOng) return;

    setErrorMsg(null);
    setFeedbackMsg(null);
    setLoading(true);

    try {
      const res = await authService.updateOngByAdmin({
        id: editingOng.id,
        cnpj: editCnpj,
        name: editName,
        email: editEmail,
        passwordPlain: editPassword.trim() ? editPassword.trim() : undefined,
        phone: editPhone,
        address: editAddress,
        city: editCity,
        state: editState,
        description: editDescription,
        image: editImage
      });

      if (!res.success || !res.ong) {
        setErrorMsg(res.error || 'Erro ao atualizar dados da ONG.');
        setLoading(false);
        return;
      }

      onUpdateOng(res.ong);
      setFeedbackMsg(`ONG "${res.ong.name}" atualizada com sucesso!`);
      setEditingOng(null);
    } catch (err: any) {
      setErrorMsg(err?.message || 'Falha ao salvar edições da ONG.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteOng = async (ong: ONG) => {
    if (!confirm(`Tem certeza que deseja excluir a ONG "${ong.name}" (${ong.cnpj})? Esta ação não pode ser desfeita.`)) {
      return;
    }

    try {
      await authService.deleteOngByAdmin(ong.id);
      onDeleteOng(ong.id);
      setFeedbackMsg(`ONG "${ong.name}" excluída do sistema.`);
    } catch (err) {
      console.error('Erro ao excluir ONG:', err);
    }
  };

  // ------------------------------------------
  // Handlers - Propagandas & Parceiros
  // ------------------------------------------
  const handleOpenEditPartner = (partner: Partner) => {
    setEditingPartner(partner);
    setEditPartnerName(partner.name || '');
    setEditPartnerCategory(partner.category || 'Saúde & Emergência');
    setEditPartnerTagline(partner.tagline || '');
    setEditPartnerImage(partner.image || '');
    setEditPartnerUrl(partner.url || '');
    setEditPartnerBadge(partner.badge || '');
    setEditPartnerDiscount(partner.discountOrBenefit || '');
    setErrorMsg(null);
  };

  const handleCreatePartner = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setFeedbackMsg(null);
    setLoading(true);

    try {
      const newPartner: Partner = {
        id: `partner-${Date.now()}`,
        name: partnerName.trim(),
        category: partnerCategory.trim() || 'Parceiro Geral',
        tagline: partnerTagline.trim(),
        image:
          partnerImage.trim() ||
          'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=800&q=80',
        url: partnerUrl.trim() || '#',
        badge: partnerBadge.trim() || undefined,
        discountOrBenefit: partnerDiscount.trim() || undefined
      };

      await dbService.savePartner(newPartner);
      onPartnerCreated(newPartner);
      setFeedbackMsg(`Propaganda "${newPartner.name}" adicionada com sucesso ao rodapé!`);

      // Reset form
      setPartnerName('');
      setPartnerCategory('Saúde & Emergência');
      setPartnerTagline('');
      setPartnerImage('');
      setPartnerUrl('');
      setPartnerBadge('Parceiro Oficial');
      setPartnerDiscount('');
      setShowCreatePartnerModal(false);
    } catch (err: any) {
      setErrorMsg(err?.message || 'Falha ao cadastrar propaganda/parceiro.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveEditPartner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPartner) return;

    setErrorMsg(null);
    setFeedbackMsg(null);
    setLoading(true);

    try {
      const updated: Partner = {
        ...editingPartner,
        name: editPartnerName.trim(),
        category: editPartnerCategory.trim() || 'Parceiro Geral',
        tagline: editPartnerTagline.trim(),
        image:
          editPartnerImage.trim() ||
          'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=800&q=80',
        url: editPartnerUrl.trim() || '#',
        badge: editPartnerBadge.trim() || undefined,
        discountOrBenefit: editPartnerDiscount.trim() || undefined
      };

      await dbService.savePartner(updated);
      onUpdatePartner(updated);
      setFeedbackMsg(`Propaganda "${updated.name}" atualizada com sucesso!`);
      setEditingPartner(null);
    } catch (err: any) {
      setErrorMsg(err?.message || 'Falha ao salvar alterações da propaganda.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePartner = async (partner: Partner) => {
    if (!confirm(`Tem certeza que deseja remover a propaganda "${partner.name}" do rodapé?`)) {
      return;
    }

    try {
      await dbService.deletePartner(partner.id);
      onDeletePartner(partner.id);
      setFeedbackMsg(`Propaganda "${partner.name}" removida com sucesso.`);
    } catch (err) {
      console.error('Erro ao excluir propaganda:', err);
    }
  };

  return (
    <main className="flex-grow pt-8 pb-20 px-4 md:px-16 max-w-7xl mx-auto w-full">
      {/* Top Header */}
      <header className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <span className="bg-[#074469] text-[#a0efd6] text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full">
            Painel do Administrador Geral
          </span>
          <span className="text-xs text-[#72787f]">Gestão Completa CorrenteCão / MatchPet</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-['Plus_Jakarta_Sans'] text-3xl md:text-4xl font-bold text-[#074469]">
              {adminTab === 'ongs' ? 'Gerenciamento de ONGs & Acessos' : 'Propagandas & Parceiros (Rodapé)'}
            </h1>
            <p className="font-['Be_Vietnam_Pro'] text-sm md:text-base text-[#41474e] mt-1">
              {adminTab === 'ongs'
                ? 'Cadastre, edite dados cadastrais, redefina senhas e monitore a rede de ONGs credenciadas.'
                : 'Adicione e edite os banners, fotos, nomes, links de redirecionamento e cupons de parceiros que aparecem no rodapé.'}
            </p>
          </div>

          {adminTab === 'ongs' ? (
            <button
              onClick={() => {
                setErrorMsg(null);
                setShowCreateModal(true);
              }}
              className="bg-[#074469] hover:bg-[#2a5c82] text-white font-['Be_Vietnam_Pro'] text-sm font-bold px-5 py-3 rounded-xl transition-all shadow-sm flex items-center gap-2 cursor-pointer shrink-0"
            >
              <span className="material-symbols-outlined text-lg">add_business</span>
              <span>Cadastrar Nova ONG</span>
            </button>
          ) : (
            <button
              onClick={() => {
                setErrorMsg(null);
                setShowCreatePartnerModal(true);
              }}
              className="bg-[#126b57] hover:bg-[#005141] text-white font-['Be_Vietnam_Pro'] text-sm font-bold px-5 py-3 rounded-xl transition-all shadow-sm flex items-center gap-2 cursor-pointer shrink-0"
            >
              <span className="material-symbols-outlined text-lg">add_photo_alternate</span>
              <span>Nova Propaganda / Parceiro</span>
            </button>
          )}
        </div>
      </header>

      {/* Navegação entre Abas do Admin */}
      <div className="flex items-center gap-3 mb-8 border-b border-[#e0e3e5] pb-4">
        <button
          onClick={() => setAdminTab('ongs')}
          className={`flex items-center gap-2.5 px-5 py-2.5 rounded-2xl font-['Be_Vietnam_Pro'] text-sm font-bold transition-all cursor-pointer ${
            adminTab === 'ongs'
              ? 'bg-[#074469] text-white shadow-md'
              : 'bg-white text-[#41474e] hover:bg-[#f2f4f6] border border-[#e0e3e5]'
          }`}
        >
          <span className="material-symbols-outlined text-lg">apartment</span>
          <span>Instituições & ONGs</span>
          <span
            className={`text-xs px-2 py-0.5 rounded-full font-extrabold ${
              adminTab === 'ongs' ? 'bg-white/20 text-white' : 'bg-[#f2f4f6] text-[#074469]'
            }`}
          >
            {ongs.length}
          </span>
        </button>

        <button
          onClick={() => setAdminTab('partners')}
          className={`flex items-center gap-2.5 px-5 py-2.5 rounded-2xl font-['Be_Vietnam_Pro'] text-sm font-bold transition-all cursor-pointer ${
            adminTab === 'partners'
              ? 'bg-[#074469] text-white shadow-md'
              : 'bg-white text-[#41474e] hover:bg-[#f2f4f6] border border-[#e0e3e5]'
          }`}
        >
          <span className="material-symbols-outlined text-lg">campaign</span>
          <span>Propagandas & Parceiros (Rodapé)</span>
          <span
            className={`text-xs px-2 py-0.5 rounded-full font-extrabold ${
              adminTab === 'partners' ? 'bg-[#a0efd6] text-[#074469]' : 'bg-[#f2f4f6] text-[#126b57]'
            }`}
          >
            {partners.length}
          </span>
        </button>
      </div>

      {/* Feedback Toast */}
      {feedbackMsg && (
        <div className="mb-6 bg-[#a0efd6]/50 border border-[#126b57]/40 text-[#005141] p-4 rounded-2xl flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2 font-['Be_Vietnam_Pro'] text-sm font-semibold">
            <span className="material-symbols-outlined text-xl text-[#126b57]">verified</span>
            <span>{feedbackMsg}</span>
          </div>
          <button onClick={() => setFeedbackMsg(null)} className="text-xs font-bold underline cursor-pointer">
            Fechar
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ABA 1: GESTÃO DE ONGS */}
      {/* ========================================================================= */}
      {adminTab === 'ongs' && (
        <>
          {/* Global Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
            <div className="bg-white rounded-2xl p-6 shadow-xs border border-[#e0e3e5]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#72787f] font-['Be_Vietnam_Pro']">
                  ONGs Credenciadas
                </span>
                <span className="material-symbols-outlined text-[#074469] text-2xl">apartment</span>
              </div>
              <p className="font-['Plus_Jakarta_Sans'] text-3xl font-bold text-[#074469]">{ongs.length}</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-xs border border-[#e0e3e5]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#72787f] font-['Be_Vietnam_Pro']">
                  Total de Pets no Sistema
                </span>
                <span className="material-symbols-outlined text-[#126b57] text-2xl">pets</span>
              </div>
              <p className="font-['Plus_Jakarta_Sans'] text-3xl font-bold text-[#126b57]">{pets.length}</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-xs border border-[#e0e3e5]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#72787f] font-['Be_Vietnam_Pro']">
                  Adoções Concedidas
                </span>
                <span className="material-symbols-outlined text-[#914100] text-2xl">favorite</span>
              </div>
              <p className="font-['Plus_Jakarta_Sans'] text-3xl font-bold text-[#914100]">
                {solicitations.filter((s) => s.status === 'approved').length}
              </p>
            </div>
          </div>

          {/* Tabela de ONGs Cadastradas com Edição */}
          <section className="bg-white rounded-3xl p-6 md:p-8 shadow-xs border border-[#e0e3e5]">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-['Plus_Jakarta_Sans'] text-2xl font-bold text-[#074469]">
                  Instituições e ONGs Parceiras
                </h2>
                <p className="font-['Be_Vietnam_Pro'] text-xs sm:text-sm text-[#72787f]">
                  Gerencie informações cadastrais, redefina senhas ou edite detalhes institucionais de cada ONG.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse font-['Be_Vietnam_Pro']">
                <thead>
                  <tr className="bg-[#f2f4f6] border-b border-[#e0e3e5] text-xs font-semibold text-[#41474e] uppercase tracking-wider">
                    <th className="p-4">ONG / Nome</th>
                    <th className="p-4">CNPJ</th>
                    <th className="p-4">E-mail de Login</th>
                    <th className="p-4">Cidade / Local</th>
                    <th className="p-4">Pets Ativos</th>
                    <th className="p-4 text-right">Ações de Gestão</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e0e3e5] text-sm">
                  {ongs.map((ong) => {
                    const ongPetsCount = pets.filter(
                      (p) => p.ongId === ong.id || p.ongName.toLowerCase() === ong.name.toLowerCase()
                    ).length;

                    return (
                      <tr key={ong.id} className="hover:bg-[#f7f9fb] transition-colors">
                        <td className="p-4 flex items-center gap-3">
                          <img
                            src={ong.image}
                            alt={ong.name}
                            className="w-10 h-10 rounded-xl object-cover border border-[#e0e3e5] shadow-2xs shrink-0"
                          />
                          <div>
                            <strong className="font-['Plus_Jakarta_Sans'] text-[#191c1e] text-base block">
                              {ong.name}
                            </strong>
                            <span className="text-xs text-[#72787f]">{ong.phone}</span>
                          </div>
                        </td>

                        <td className="p-4 text-xs font-mono text-[#41474e]">
                          {ong.cnpj || '12.345.678/0001-90'}
                        </td>

                        <td className="p-4 text-xs text-[#074469] font-medium">
                          {ong.email || 'contato@ong.org.br'}
                        </td>

                        <td className="p-4 text-xs text-[#41474e]">
                          {ong.city}, {ong.state}
                        </td>

                        <td className="p-4">
                          <span className="bg-[#f2f4f6] text-[#074469] font-bold text-xs px-2.5 py-1 rounded-md border border-[#e0e3e5]">
                            {ongPetsCount} pets
                          </span>
                        </td>

                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleOpenEdit(ong)}
                              className="bg-[#f2f4f6] hover:bg-[#074469] text-[#074469] hover:text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 cursor-pointer border border-[#c1c7cf]/60"
                              title="Editar dados da ONG"
                            >
                              <span className="material-symbols-outlined text-sm">edit</span>
                              <span>Editar</span>
                            </button>
                            <button
                              onClick={() => handleDeleteOng(ong)}
                              className="bg-white hover:bg-[#ffdad6] text-[#ba1a1a] text-xs font-bold p-1.5 rounded-lg transition-colors border border-[#ffdad6] cursor-pointer"
                              title="Excluir ONG"
                            >
                              <span className="material-symbols-outlined text-base">delete</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}

      {/* ========================================================================= */}
      {/* ABA 2: GESTÃO DE PROPAGANDAS & PARCEIROS (RODAPÉ) */}
      {/* ========================================================================= */}
      {adminTab === 'partners' && (
        <>
          {/* Métricas de Propagandas */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
            <div className="bg-white rounded-2xl p-6 shadow-xs border border-[#e0e3e5]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#72787f] font-['Be_Vietnam_Pro']">
                  Propagandas Ativas
                </span>
                <span className="material-symbols-outlined text-[#126b57] text-2xl">campaign</span>
              </div>
              <p className="font-['Plus_Jakarta_Sans'] text-3xl font-bold text-[#126b57]">{partners.length}</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-xs border border-[#e0e3e5]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#72787f] font-['Be_Vietnam_Pro']">
                  Categorias Diferentes
                </span>
                <span className="material-symbols-outlined text-[#074469] text-2xl">category</span>
              </div>
              <p className="font-['Plus_Jakarta_Sans'] text-3xl font-bold text-[#074469]">
                {new Set(partners.map((p) => p.category)).size}
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-xs border border-[#e0e3e5]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#72787f] font-['Be_Vietnam_Pro']">
                  Com Cupons / Benefícios
                </span>
                <span className="material-symbols-outlined text-[#914100] text-2xl">redeem</span>
              </div>
              <p className="font-['Plus_Jakarta_Sans'] text-3xl font-bold text-[#914100]">
                {partners.filter((p) => p.discountOrBenefit && p.discountOrBenefit.length > 0).length}
              </p>
            </div>
          </div>

          {/* Lista e Grade de Propagandas Cadastradas */}
          <section className="bg-white rounded-3xl p-6 md:p-8 shadow-xs border border-[#e0e3e5]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="font-['Plus_Jakarta_Sans'] text-2xl font-bold text-[#074469]">
                  Propagandas em Exibição no Rodapé
                </h2>
                <p className="font-['Be_Vietnam_Pro'] text-xs sm:text-sm text-[#72787f]">
                  Os cartões abaixo são exibidos no carrossel infinito inferior para todos os visitantes do site.
                </p>
              </div>

              <button
                onClick={() => {
                  setErrorMsg(null);
                  setShowCreatePartnerModal(true);
                }}
                className="bg-[#126b57] hover:bg-[#005141] text-white font-['Be_Vietnam_Pro'] text-xs sm:text-sm font-bold px-4 py-2.5 rounded-xl transition-all shadow-sm flex items-center gap-2 cursor-pointer shrink-0"
              >
                <span className="material-symbols-outlined text-base">add_circle</span>
                <span>Nova Propaganda</span>
              </button>
            </div>

            {partners.length === 0 ? (
              <div className="text-center py-16 px-4 bg-[#f7f9fb] rounded-2xl border border-dashed border-[#c1c7cf]">
                <span className="material-symbols-outlined text-5xl text-[#72787f] mb-3">campaign</span>
                <h3 className="font-['Plus_Jakarta_Sans'] text-lg font-bold text-[#074469]">
                  Nenhuma propaganda cadastrada no momento
                </h3>
                <p className="font-['Be_Vietnam_Pro'] text-xs text-[#72787f] max-w-md mx-auto mt-1 mb-4">
                  Adicione novos parceiros, pet shops, hospitais veterinários ou anúncios para veicular no rodapé do site.
                </p>
                <button
                  onClick={() => setShowCreatePartnerModal(true)}
                  className="bg-[#074469] hover:bg-[#2a5c82] text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all cursor-pointer"
                >
                  Cadastrar Primeira Propaganda
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {partners.map((partner) => (
                  <div
                    key={partner.id}
                    className="bg-white rounded-2xl border border-[#e0e3e5] overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between group"
                  >
                    {/* Imagem de Capa do Anúncio */}
                    <div className="relative h-44 w-full bg-slate-900 overflow-hidden">
                      <img
                        src={partner.image}
                        alt={partner.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=800&q=80';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                      {/* Selo / Badge */}
                      {partner.badge && (
                        <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md text-[#074469] font-['Be_Vietnam_Pro'] text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-sm border border-white/50 flex items-center gap-1">
                          <span className="material-symbols-outlined text-xs text-[#126b57]">verified</span>
                          <span>{partner.badge}</span>
                        </div>
                      )}

                      {/* Categoria */}
                      <div className="absolute bottom-3 left-3">
                        <span className="font-['Be_Vietnam_Pro'] text-xs font-medium bg-black/50 backdrop-blur-xs text-white px-2.5 py-0.5 rounded-md border border-white/20">
                          {partner.category}
                        </span>
                      </div>
                    </div>

                    {/* Detalhes do Anúncio */}
                    <div className="p-5 flex flex-col flex-grow justify-between gap-3 font-['Be_Vietnam_Pro']">
                      <div>
                        <h3 className="font-['Plus_Jakarta_Sans'] text-lg font-bold text-[#074469]">
                          {partner.name}
                        </h3>
                        <p className="text-xs text-[#41474e] mt-1 line-clamp-2 leading-relaxed">
                          {partner.tagline}
                        </p>
                      </div>

                      {/* Link de destino */}
                      <div className="pt-2 border-t border-[#e0e3e5]">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#72787f] block mb-0.5">
                          Link de Destino
                        </span>
                        <a
                          href={partner.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-[#074469] font-semibold hover:underline flex items-center gap-1 truncate"
                          title={partner.url}
                        >
                          <span className="material-symbols-outlined text-sm shrink-0">link</span>
                          <span className="truncate">{partner.url || 'Sem link configurado'}</span>
                        </a>
                      </div>

                      {/* Benefício / Desconto */}
                      {partner.discountOrBenefit && (
                        <div className="bg-[#a0efd6]/30 text-[#005141] text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5 border border-[#126b57]/20">
                          <span className="material-symbols-outlined text-sm text-[#126b57] shrink-0">redeem</span>
                          <span className="truncate">{partner.discountOrBenefit}</span>
                        </div>
                      )}

                      {/* Botões de Ação */}
                      <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#e0e3e5] mt-2">
                        <button
                          onClick={() => handleOpenEditPartner(partner)}
                          className="bg-[#f2f4f6] hover:bg-[#074469] text-[#074469] hover:text-white text-xs font-bold px-3 py-2 rounded-xl transition-colors flex items-center gap-1 cursor-pointer border border-[#c1c7cf]/60"
                        >
                          <span className="material-symbols-outlined text-sm">edit</span>
                          <span>Editar</span>
                        </button>
                        <button
                          onClick={() => handleDeletePartner(partner)}
                          className="bg-white hover:bg-[#ffdad6] text-[#ba1a1a] text-xs font-bold p-2 rounded-xl transition-colors border border-[#ffdad6] cursor-pointer"
                          title="Remover propaganda"
                        >
                          <span className="material-symbols-outlined text-base">delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </>
      )}

      {/* ========================================================================= */}
      {/* MODAL: CRIAR NOVA PROPAGANDA / PARCEIRO */}
      {/* ========================================================================= */}
      {showCreatePartnerModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 md:p-8 shadow-2xl border border-[#e0e3e5] relative animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto font-['Be_Vietnam_Pro']">
            <button
              onClick={() => setShowCreatePartnerModal(false)}
              className="absolute top-5 right-5 text-[#72787f] hover:text-[#191c1e] p-1.5 rounded-full hover:bg-[#e0e3e5] cursor-pointer"
            >
              <span className="material-symbols-outlined">close</span>
            </button>

            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-[#126b57] text-[#a0efd6] flex items-center justify-center">
                <span className="material-symbols-outlined text-2xl">campaign</span>
              </div>
              <div>
                <h2 className="font-['Plus_Jakarta_Sans'] text-2xl font-bold text-[#074469]">
                  Nova Propaganda do Rodapé
                </h2>
                <p className="text-xs text-[#72787f]">
                  Configure os dados, imagem e link de redirecionamento do anúncio.
                </p>
              </div>
            </div>

            {errorMsg && (
              <div className="my-4 bg-[#ffdad6] text-[#ba1a1a] p-3 rounded-xl text-xs flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">error</span>
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleCreatePartner} className="space-y-4 mt-6 text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Nome do Parceiro */}
                <div>
                  <label className="block text-xs font-semibold text-[#41474e] mb-1">
                    Nome da Empresa / Parceiro *
                  </label>
                  <input
                    type="text"
                    required
                    value={partnerName}
                    onChange={(e) => setPartnerName(e.target.value)}
                    placeholder="Ex: Hospital Veterinário VidaPet 24h"
                    className="w-full bg-[#f2f4f6] border border-[#c1c7cf] rounded-xl p-2.5 outline-none focus:border-[#074469] focus:bg-white"
                  />
                </div>

                {/* Categoria */}
                <div>
                  <label className="block text-xs font-semibold text-[#41474e] mb-1">
                    Categoria do Serviço *
                  </label>
                  <input
                    type="text"
                    required
                    value={partnerCategory}
                    onChange={(e) => setPartnerCategory(e.target.value)}
                    placeholder="Ex: Saúde & Emergência, Pet Shop, Nutrição"
                    className="w-full bg-[#f2f4f6] border border-[#c1c7cf] rounded-xl p-2.5 outline-none focus:border-[#074469] focus:bg-white"
                  />
                </div>
              </div>

              {/* Slogan / Descrição Curta */}
              <div>
                <label className="block text-xs font-semibold text-[#41474e] mb-1">
                  Slogan ou Frase de Destaque (Tagline) *
                </label>
                <input
                  type="text"
                  required
                  value={partnerTagline}
                  onChange={(e) => setPartnerTagline(e.target.value)}
                  placeholder="Ex: Pronto-atendimento 24h e UTI veterinária completa"
                  className="w-full bg-[#f2f4f6] border border-[#c1c7cf] rounded-xl p-2.5 outline-none focus:border-[#074469] focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Link de Destino / URL */}
                <div>
                  <label className="block text-xs font-semibold text-[#41474e] mb-1">
                    Link de Destino / Redirecionamento (URL) *
                  </label>
                  <input
                    type="url"
                    required
                    value={partnerUrl}
                    onChange={(e) => setPartnerUrl(e.target.value)}
                    placeholder="https://empresa.com.br ou wa.me/..."
                    className="w-full bg-[#f2f4f6] border border-[#c1c7cf] rounded-xl p-2.5 outline-none focus:border-[#074469] focus:bg-white text-xs"
                  />
                </div>

                {/* Selo / Badge */}
                <div>
                  <label className="block text-xs font-semibold text-[#41474e] mb-1">
                    Selo de Destaque (Opcional)
                  </label>
                  <input
                    type="text"
                    value={partnerBadge}
                    onChange={(e) => setPartnerBadge(e.target.value)}
                    placeholder="Ex: Parceiro Master, 10% OFF, Destaque"
                    className="w-full bg-[#f2f4f6] border border-[#c1c7cf] rounded-xl p-2.5 outline-none focus:border-[#074469] focus:bg-white text-xs"
                  />
                </div>
              </div>

              {/* Benefício / Cupom */}
              <div>
                <label className="block text-xs font-semibold text-[#41474e] mb-1">
                  Cupom ou Benefício Exclusivo para Adotantes (Opcional)
                </label>
                <input
                  type="text"
                  value={partnerDiscount}
                  onChange={(e) => setPartnerDiscount(e.target.value)}
                  placeholder="Ex: 15% de desconto para adotantes MatchPet ou Cupom R$ 50"
                  className="w-full bg-[#f2f4f6] border border-[#c1c7cf] rounded-xl p-2.5 outline-none focus:border-[#074469] focus:bg-white text-xs"
                />
              </div>

              {/* Imagem / Foto do Banner */}
              <div>
                <label className="block text-xs font-semibold text-[#41474e] mb-1">
                  URL da Imagem / Banner do Anúncio *
                </label>
                <input
                  type="url"
                  required
                  value={partnerImage}
                  onChange={(e) => setPartnerImage(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-[#f2f4f6] border border-[#c1c7cf] rounded-xl p-2.5 outline-none focus:border-[#074469] focus:bg-white text-xs"
                />
              </div>

              {/* Pré-visualização da Imagem */}
              {partnerImage && (
                <div className="mt-3 p-3 bg-[#f7f9fb] rounded-2xl border border-[#e0e3e5]">
                  <span className="text-[11px] font-bold text-[#72787f] uppercase tracking-wider block mb-2">
                    Pré-visualização do Banner
                  </span>
                  <div className="h-32 w-full rounded-xl overflow-hidden bg-slate-900 relative">
                    <img
                      src={partnerImage}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=800&q=80';
                      }}
                    />
                    <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-xs text-white text-xs px-2 py-0.5 rounded-md">
                      {partnerName || 'Nome do Parceiro'}
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4 border-t border-[#e0e3e5]">
                <button
                  type="button"
                  onClick={() => setShowCreatePartnerModal(false)}
                  className="px-5 py-2.5 text-[#41474e] font-semibold hover:bg-[#e0e3e5] rounded-xl cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-[#126b57] hover:bg-[#005141] disabled:opacity-60 text-white font-bold px-6 py-2.5 rounded-xl transition-all shadow-sm flex items-center gap-2 cursor-pointer"
                >
                  {loading ? 'Salvando...' : 'Adicionar Propaganda'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: EDITAR PROPAGANDA / PARCEIRO EXISTENTE */}
      {/* ========================================================================= */}
      {editingPartner && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 md:p-8 shadow-2xl border border-[#e0e3e5] relative animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto font-['Be_Vietnam_Pro']">
            <button
              onClick={() => setEditingPartner(null)}
              className="absolute top-5 right-5 text-[#72787f] hover:text-[#191c1e] p-1.5 rounded-full hover:bg-[#e0e3e5] cursor-pointer"
            >
              <span className="material-symbols-outlined">close</span>
            </button>

            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-[#074469] text-[#a0efd6] flex items-center justify-center">
                <span className="material-symbols-outlined text-2xl">edit</span>
              </div>
              <div>
                <h2 className="font-['Plus_Jakarta_Sans'] text-2xl font-bold text-[#074469]">
                  Editar Propaganda: {editingPartner.name}
                </h2>
                <p className="text-xs text-[#72787f]">
                  Modifique foto, slogan, link de destino ou cupons da propaganda.
                </p>
              </div>
            </div>

            {errorMsg && (
              <div className="my-4 bg-[#ffdad6] text-[#ba1a1a] p-3 rounded-xl text-xs flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">error</span>
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSaveEditPartner} className="space-y-4 mt-6 text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Nome do Parceiro */}
                <div>
                  <label className="block text-xs font-semibold text-[#41474e] mb-1">
                    Nome da Empresa / Parceiro *
                  </label>
                  <input
                    type="text"
                    required
                    value={editPartnerName}
                    onChange={(e) => setEditPartnerName(e.target.value)}
                    className="w-full bg-[#f2f4f6] border border-[#c1c7cf] rounded-xl p-2.5 outline-none focus:border-[#074469] focus:bg-white"
                  />
                </div>

                {/* Categoria */}
                <div>
                  <label className="block text-xs font-semibold text-[#41474e] mb-1">
                    Categoria do Serviço *
                  </label>
                  <input
                    type="text"
                    required
                    value={editPartnerCategory}
                    onChange={(e) => setEditPartnerCategory(e.target.value)}
                    className="w-full bg-[#f2f4f6] border border-[#c1c7cf] rounded-xl p-2.5 outline-none focus:border-[#074469] focus:bg-white"
                  />
                </div>
              </div>

              {/* Slogan / Descrição Curta */}
              <div>
                <label className="block text-xs font-semibold text-[#41474e] mb-1">
                  Slogan ou Frase de Destaque (Tagline) *
                </label>
                <input
                  type="text"
                  required
                  value={editPartnerTagline}
                  onChange={(e) => setEditPartnerTagline(e.target.value)}
                  className="w-full bg-[#f2f4f6] border border-[#c1c7cf] rounded-xl p-2.5 outline-none focus:border-[#074469] focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Link de Destino / URL */}
                <div>
                  <label className="block text-xs font-semibold text-[#41474e] mb-1">
                    Link de Destino / Redirecionamento (URL) *
                  </label>
                  <input
                    type="url"
                    required
                    value={editPartnerUrl}
                    onChange={(e) => setEditPartnerUrl(e.target.value)}
                    className="w-full bg-[#f2f4f6] border border-[#c1c7cf] rounded-xl p-2.5 outline-none focus:border-[#074469] focus:bg-white text-xs"
                  />
                </div>

                {/* Selo / Badge */}
                <div>
                  <label className="block text-xs font-semibold text-[#41474e] mb-1">
                    Selo de Destaque (Opcional)
                  </label>
                  <input
                    type="text"
                    value={editPartnerBadge}
                    onChange={(e) => setEditPartnerBadge(e.target.value)}
                    placeholder="Ex: Parceiro Master, 10% OFF"
                    className="w-full bg-[#f2f4f6] border border-[#c1c7cf] rounded-xl p-2.5 outline-none focus:border-[#074469] focus:bg-white text-xs"
                  />
                </div>
              </div>

              {/* Benefício / Cupom */}
              <div>
                <label className="block text-xs font-semibold text-[#41474e] mb-1">
                  Cupom ou Benefício Exclusivo para Adotantes (Opcional)
                </label>
                <input
                  type="text"
                  value={editPartnerDiscount}
                  onChange={(e) => setEditPartnerDiscount(e.target.value)}
                  placeholder="Ex: 15% de desconto para adotantes"
                  className="w-full bg-[#f2f4f6] border border-[#c1c7cf] rounded-xl p-2.5 outline-none focus:border-[#074469] focus:bg-white text-xs"
                />
              </div>

              {/* Imagem / Foto do Banner */}
              <div>
                <label className="block text-xs font-semibold text-[#41474e] mb-1">
                  URL da Imagem / Banner do Anúncio *
                </label>
                <input
                  type="url"
                  required
                  value={editPartnerImage}
                  onChange={(e) => setEditPartnerImage(e.target.value)}
                  className="w-full bg-[#f2f4f6] border border-[#c1c7cf] rounded-xl p-2.5 outline-none focus:border-[#074469] focus:bg-white text-xs"
                />
              </div>

              {/* Pré-visualização da Imagem */}
              {editPartnerImage && (
                <div className="mt-3 p-3 bg-[#f7f9fb] rounded-2xl border border-[#e0e3e5]">
                  <span className="text-[11px] font-bold text-[#72787f] uppercase tracking-wider block mb-2">
                    Pré-visualização do Banner
                  </span>
                  <div className="h-32 w-full rounded-xl overflow-hidden bg-slate-900 relative">
                    <img
                      src={editPartnerImage}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=800&q=80';
                      }}
                    />
                    <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-xs text-white text-xs px-2 py-0.5 rounded-md">
                      {editPartnerName || 'Nome do Parceiro'}
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4 border-t border-[#e0e3e5]">
                <button
                  type="button"
                  onClick={() => setEditingPartner(null)}
                  className="px-5 py-2.5 text-[#41474e] font-semibold hover:bg-[#e0e3e5] rounded-xl cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-[#074469] hover:bg-[#2a5c82] disabled:opacity-60 text-white font-bold px-6 py-2.5 rounded-xl transition-all shadow-sm flex items-center gap-2 cursor-pointer"
                >
                  {loading ? 'Salvando...' : 'Salvar Alterações'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: CRIAÇÃO DE NOVA ONG */}
      {/* ========================================================================= */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 md:p-8 shadow-2xl border border-[#e0e3e5] relative animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowCreateModal(false)}
              className="absolute top-5 right-5 text-[#72787f] hover:text-[#191c1e] p-1.5 rounded-full hover:bg-[#e0e3e5] cursor-pointer"
            >
              <span className="material-symbols-outlined">close</span>
            </button>

            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-[#074469] text-[#a0efd6] flex items-center justify-center">
                <span className="material-symbols-outlined text-2xl">add_business</span>
              </div>
              <div>
                <h2 className="font-['Plus_Jakarta_Sans'] text-2xl font-bold text-[#074469]">
                  Cadastrar Nova ONG Parceira
                </h2>
                <p className="font-['Be_Vietnam_Pro'] text-xs text-[#72787f]">
                  Gere o login exclusivo e defina as informações cadastrais da instituição.
                </p>
              </div>
            </div>

            {errorMsg && (
              <div className="my-4 bg-[#ffdad6] text-[#ba1a1a] p-3 rounded-xl text-xs font-['Be_Vietnam_Pro'] flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">error</span>
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleCreateOng} className="space-y-4 mt-6 font-['Be_Vietnam_Pro'] text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* CNPJ */}
                <div>
                  <label className="block text-xs font-semibold text-[#41474e] mb-1">
                    CNPJ da ONG *
                  </label>
                  <input
                    type="text"
                    required
                    value={cnpj}
                    onChange={(e) => setCnpj(formatCnpj(e.target.value))}
                    placeholder="00.000.000/0001-00"
                    className="w-full bg-[#f2f4f6] border border-[#c1c7cf] rounded-xl p-2.5 outline-none focus:border-[#074469] focus:bg-white font-mono text-xs"
                  />
                </div>

                {/* Nome */}
                <div>
                  <label className="block text-xs font-semibold text-[#41474e] mb-1">
                    Nome da ONG *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ex: Associação Patinhas do Bem"
                    className="w-full bg-[#f2f4f6] border border-[#c1c7cf] rounded-xl p-2.5 outline-none focus:border-[#074469] focus:bg-white"
                  />
                </div>
              </div>

              {/* Credenciais de Login para a ONG */}
              <div className="bg-[#f7f9fb] p-4 rounded-2xl border border-[#074469]/20 space-y-3">
                <span className="text-[11px] font-bold text-[#074469] uppercase tracking-wider block">
                  Credenciais de Login da ONG
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#41474e] mb-1">
                      E-mail de Acesso *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="login@ong.org.br"
                      className="w-full bg-white border border-[#c1c7cf] rounded-xl p-2.5 outline-none focus:border-[#074469]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#41474e] mb-1">
                      Senha Provisória da ONG *
                    </label>
                    <input
                      type="text"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Mínimo 6 caracteres"
                      className="w-full bg-white border border-[#c1c7cf] rounded-xl p-2.5 outline-none focus:border-[#074469] font-mono text-xs"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Telefone */}
                <div>
                  <label className="block text-xs font-semibold text-[#41474e] mb-1">
                    Telefone / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="(11) 98765-4321"
                    className="w-full bg-[#f2f4f6] border border-[#c1c7cf] rounded-xl p-2.5 outline-none focus:border-[#074469] focus:bg-white"
                  />
                </div>

                {/* Endereço */}
                <div>
                  <label className="block text-xs font-semibold text-[#41474e] mb-1">
                    Endereço Completo *
                  </label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Rua, número e bairro"
                    className="w-full bg-[#f2f4f6] border border-[#c1c7cf] rounded-xl p-2.5 outline-none focus:border-[#074469] focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#41474e] mb-1">
                    Cidade
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-[#f2f4f6] border border-[#c1c7cf] rounded-xl p-2.5 outline-none focus:border-[#074469] focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#41474e] mb-1">
                    Estado (UF)
                  </label>
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value.toUpperCase().slice(0, 2))}
                    className="w-full bg-[#f2f4f6] border border-[#c1c7cf] rounded-xl p-2.5 outline-none focus:border-[#074469] focus:bg-white uppercase font-mono"
                  />
                </div>
              </div>

              {/* Descrição */}
              <div>
                <label className="block text-xs font-semibold text-[#41474e] mb-1">
                  Descrição da Instituição *
                </label>
                <textarea
                  required
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Conte sobre o trabalho da ONG, estrutura e missão..."
                  className="w-full bg-[#f2f4f6] border border-[#c1c7cf] rounded-xl p-2.5 outline-none focus:border-[#074469] focus:bg-white resize-none"
                />
              </div>

              {/* Imagem / Logo */}
              <div>
                <label className="block text-xs font-semibold text-[#41474e] mb-1">
                  URL da Foto ou Logo (Opcional)
                </label>
                <input
                  type="url"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="https://exemplo.com/logo-ong.jpg"
                  className="w-full bg-[#f2f4f6] border border-[#c1c7cf] rounded-xl p-2.5 outline-none focus:border-[#074469] focus:bg-white text-xs"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#e0e3e5]">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-5 py-2.5 text-[#41474e] font-semibold hover:bg-[#e0e3e5] rounded-xl cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-[#074469] hover:bg-[#2a5c82] disabled:opacity-60 text-white font-bold px-6 py-2.5 rounded-xl transition-all shadow-sm flex items-center gap-2 cursor-pointer"
                >
                  {loading ? 'Criando Conta...' : 'Criar Conta da ONG'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: EDIÇÃO DE ONG EXISTENTE */}
      {/* ========================================================================= */}
      {editingOng && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 md:p-8 shadow-2xl border border-[#e0e3e5] relative animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setEditingOng(null)}
              className="absolute top-5 right-5 text-[#72787f] hover:text-[#191c1e] p-1.5 rounded-full hover:bg-[#e0e3e5] cursor-pointer"
            >
              <span className="material-symbols-outlined">close</span>
            </button>

            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-[#126b57] text-[#a0efd6] flex items-center justify-center">
                <span className="material-symbols-outlined text-2xl">edit_note</span>
              </div>
              <div>
                <h2 className="font-['Plus_Jakarta_Sans'] text-2xl font-bold text-[#074469]">
                  Editar ONG: {editingOng.name}
                </h2>
                <p className="font-['Be_Vietnam_Pro'] text-xs text-[#72787f]">
                  Modifique dados cadastrais, endereço ou defina uma nova senha de acesso.
                </p>
              </div>
            </div>

            {errorMsg && (
              <div className="my-4 bg-[#ffdad6] text-[#ba1a1a] p-3 rounded-xl text-xs font-['Be_Vietnam_Pro'] flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">error</span>
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSaveEditOng} className="space-y-4 mt-6 font-['Be_Vietnam_Pro'] text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* CNPJ */}
                <div>
                  <label className="block text-xs font-semibold text-[#41474e] mb-1">
                    CNPJ da ONG *
                  </label>
                  <input
                    type="text"
                    required
                    value={editCnpj}
                    onChange={(e) => setEditCnpj(formatCnpj(e.target.value))}
                    placeholder="00.000.000/0001-00"
                    className="w-full bg-[#f2f4f6] border border-[#c1c7cf] rounded-xl p-2.5 outline-none focus:border-[#074469] focus:bg-white font-mono text-xs"
                  />
                </div>

                {/* Nome */}
                <div>
                  <label className="block text-xs font-semibold text-[#41474e] mb-1">
                    Nome da ONG *
                  </label>
                  <input
                    type="text"
                    required
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    placeholder="Ex: Associação Patinhas do Bem"
                    className="w-full bg-[#f2f4f6] border border-[#c1c7cf] rounded-xl p-2.5 outline-none focus:border-[#074469] focus:bg-white"
                  />
                </div>
              </div>

              {/* Credenciais de Login para a ONG */}
              <div className="bg-[#f7f9fb] p-4 rounded-2xl border border-[#074469]/20 space-y-3">
                <span className="text-[11px] font-bold text-[#074469] uppercase tracking-wider block">
                  Acesso & Credenciais
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#41474e] mb-1">
                      E-mail de Login *
                    </label>
                    <input
                      type="email"
                      required
                      value={editEmail}
                      onChange={(e) => setEditEmail(e.target.value)}
                      placeholder="login@ong.org.br"
                      className="w-full bg-white border border-[#c1c7cf] rounded-xl p-2.5 outline-none focus:border-[#074469]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#41474e] mb-1">
                      Redefinir Senha (Opcional)
                    </label>
                    <input
                      type="text"
                      value={editPassword}
                      onChange={(e) => setEditPassword(e.target.value)}
                      placeholder="Deixe vazio para manter atual"
                      className="w-full bg-white border border-[#c1c7cf] rounded-xl p-2.5 outline-none focus:border-[#074469] font-mono text-xs"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Telefone */}
                <div>
                  <label className="block text-xs font-semibold text-[#41474e] mb-1">
                    Telefone / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    placeholder="(11) 98765-4321"
                    className="w-full bg-[#f2f4f6] border border-[#c1c7cf] rounded-xl p-2.5 outline-none focus:border-[#074469] focus:bg-white"
                  />
                </div>

                {/* Endereço */}
                <div>
                  <label className="block text-xs font-semibold text-[#41474e] mb-1">
                    Endereço Completo *
                  </label>
                  <input
                    type="text"
                    required
                    value={editAddress}
                    onChange={(e) => setEditAddress(e.target.value)}
                    placeholder="Rua, número e bairro"
                    className="w-full bg-[#f2f4f6] border border-[#c1c7cf] rounded-xl p-2.5 outline-none focus:border-[#074469] focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#41474e] mb-1">
                    Cidade
                  </label>
                  <input
                    type="text"
                    value={editCity}
                    onChange={(e) => setEditCity(e.target.value)}
                    className="w-full bg-[#f2f4f6] border border-[#c1c7cf] rounded-xl p-2.5 outline-none focus:border-[#074469] focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#41474e] mb-1">
                    Estado (UF)
                  </label>
                  <input
                    type="text"
                    value={editState}
                    onChange={(e) => setEditState(e.target.value.toUpperCase().slice(0, 2))}
                    className="w-full bg-[#f2f4f6] border border-[#c1c7cf] rounded-xl p-2.5 outline-none focus:border-[#074469] focus:bg-white uppercase font-mono"
                  />
                </div>
              </div>

              {/* Descrição */}
              <div>
                <label className="block text-xs font-semibold text-[#41474e] mb-1">
                  Descrição da Instituição *
                </label>
                <textarea
                  required
                  rows={2}
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  placeholder="Conte sobre o trabalho da ONG, estrutura e missão..."
                  className="w-full bg-[#f2f4f6] border border-[#c1c7cf] rounded-xl p-2.5 outline-none focus:border-[#074469] focus:bg-white resize-none"
                />
              </div>

              {/* Imagem / Logo */}
              <div>
                <label className="block text-xs font-semibold text-[#41474e] mb-1">
                  URL da Foto ou Logo (Opcional)
                </label>
                <input
                  type="url"
                  value={editImage}
                  onChange={(e) => setEditImage(e.target.value)}
                  placeholder="https://exemplo.com/logo-ong.jpg"
                  className="w-full bg-[#f2f4f6] border border-[#c1c7cf] rounded-xl p-2.5 outline-none focus:border-[#074469] focus:bg-white text-xs"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#e0e3e5]">
                <button
                  type="button"
                  onClick={() => setEditingOng(null)}
                  className="px-5 py-2.5 text-[#41474e] font-semibold hover:bg-[#e0e3e5] rounded-xl cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-[#126b57] hover:bg-[#005141] disabled:opacity-60 text-white font-bold px-6 py-2.5 rounded-xl transition-all shadow-sm flex items-center gap-2 cursor-pointer"
                >
                  {loading ? 'Salvando...' : 'Salvar Alterações'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
};
