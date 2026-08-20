import React, { useState } from 'react';
import { ONG, Pet, Solicitation } from '../types';
import { authService } from '../services/authService';

interface AdminDashboardViewProps {
  ongs: ONG[];
  pets: Pet[];
  solicitations: Solicitation[];
  onOngCreated: (newOng: ONG) => void;
}

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({
  ongs,
  pets,
  solicitations,
  onOngCreated
}) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form states
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

  const formatCnpj = (val: string) => {
    return val
      .replace(/\D/g, '')
      .replace(/^(\d{2})(\d)/, '$1.$2')
      .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
      .replace(/\.(\d{3})(\d)/, '.$1/$2')
      .replace(/(\d{4})(\d)/, '$1-$2')
      .slice(0, 18);
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

  return (
    <main className="flex-grow pt-8 pb-20 px-4 md:px-16 max-w-7xl mx-auto w-full">
      {/* Top Header */}
      <header className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <span className="bg-[#074469] text-[#a0efd6] text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full">
            Painel do Administrador Geral
          </span>
          <span className="text-xs text-[#72787f]">Gestão MatchPet</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-['Plus_Jakarta_Sans'] text-3xl md:text-4xl font-bold text-[#074469]">
              Gerenciamento de ONGs & Acessos
            </h1>
            <p className="font-['Be_Vietnam_Pro'] text-sm md:text-base text-[#41474e] mt-1">
              Cadastre novas ONGs parceiras, emita credenciais de acesso e monitore a rede MatchPet.
            </p>
          </div>

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
        </div>
      </header>

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

      {/* Tabela de ONGs Cadastradas */}
      <section className="bg-white rounded-3xl p-6 md:p-8 shadow-xs border border-[#e0e3e5]">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-['Plus_Jakarta_Sans'] text-2xl font-bold text-[#074469]">
              Instituições e ONGs Parceiras
            </h2>
            <p className="font-['Be_Vietnam_Pro'] text-xs sm:text-sm text-[#72787f]">
              Cada ONG possui login próprio e gerencia seus pets em ambiente 100% isolado.
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
                <th className="p-4 text-right">Status do Acesso</th>
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
                      <span className="bg-[#a0efd6] text-[#126b57] text-xs font-bold px-3 py-1 rounded-full inline-flex items-center gap-1">
                        <span className="material-symbols-outlined text-xs">key</span>
                        Ativo
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* MODAL DE CRIAÇÃO DE ONG PELO ADMIN */}
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
    </main>
  );
};
