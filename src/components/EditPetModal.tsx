import React, { useState } from 'react';
import { Pet, Species, Size, Gender, AgeGroup } from '../types';

interface EditPetModalProps {
  pet: Pet;
  onClose: () => void;
  onSave: (updatedPet: Pet) => void;
}

export const EditPetModal: React.FC<EditPetModalProps> = ({ pet, onClose, onSave }) => {
  const [name, setName] = useState(pet.name);
  const [species, setSpecies] = useState<Species>(pet.species || 'Cachorro');
  const [breed, setBreed] = useState(pet.breed || 'SRD');
  const [age, setAge] = useState(pet.age || '2 anos');
  const [ageGroup, setAgeGroup] = useState<AgeGroup>(pet.ageGroup || 'Adulto');
  const [gender, setGender] = useState<Gender>(pet.gender || 'Macho');
  const [size, setSize] = useState<Size>(pet.size || 'Médio');
  const [color, setColor] = useState(pet.color || 'Caramelo');
  const [vaccinated, setVaccinated] = useState(pet.vaccination === 'Vacinado');
  const [castrated, setCastrated] = useState(pet.castrated ?? true);
  const [dewormed, setDewormed] = useState(pet.dewormed ?? true);
  const [specialNeeds, setSpecialNeeds] = useState(pet.specialNeeds ?? false);
  const [description, setDescription] = useState(pet.description || '');
  const [status, setStatus] = useState<'Disponível' | 'Em Processo' | 'Adotado'>(pet.status || 'Disponível');

  // Galeria de Fotos Múltiplas
  const [mainImage, setMainImage] = useState(pet.mainImage);
  const [galleryImages, setGalleryImages] = useState<string[]>(pet.galleryImages || []);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [activeTab, setActiveTab] = useState<'dados' | 'fotos' | 'historico'>('dados');

  // Upload de arquivos de imagem
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        if (!mainImage) {
          setMainImage(result);
        } else {
          setGalleryImages((prev) => [...prev, result]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleAddImageUrl = () => {
    if (!newImageUrl.trim()) return;
    if (!mainImage) {
      setMainImage(newImageUrl.trim());
    } else {
      setGalleryImages((prev) => [...prev, newImageUrl.trim()]);
    }
    setNewImageUrl('');
  };

  const handleRemoveGalleryImage = (indexToRemove: number) => {
    setGalleryImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSetAsMain = (imageUrl: string, galleryIndex: number) => {
    const oldMain = mainImage;
    setMainImage(imageUrl);
    setGalleryImages((prev) => {
      const copy = [...prev];
      copy[galleryIndex] = oldMain;
      return copy;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const updated: Pet = {
      ...pet,
      name: name.trim(),
      species,
      breed: breed.trim() || 'SRD',
      age: age.trim() || '2 anos',
      ageGroup,
      gender,
      size,
      color: color.trim() || 'Caramelo',
      vaccination: vaccinated ? 'Vacinado' : 'Pendente',
      castrated,
      dewormed,
      specialNeeds,
      description: description.trim(),
      mainImage: mainImage || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1',
      galleryImages,
      status
    };

    onSave(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 md:p-8 shadow-2xl border border-[#e0e3e5] relative animate-in fade-in zoom-in duration-200 max-h-[92vh] overflow-y-auto font-['Be_Vietnam_Pro']">
        {/* Fechar */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-[#72787f] hover:text-[#191c1e] p-2 rounded-full hover:bg-[#e0e3e5] cursor-pointer"
        >
          <span className="material-symbols-outlined">close</span>
        </button>

        {/* Cabeçalho */}
        <div className="flex items-center gap-4 pb-4 mb-4 border-b border-[#e0e3e5]">
          <img
            src={mainImage || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1'}
            alt={name}
            className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover border border-[#e0e3e5] shadow-xs shrink-0"
          />
          <div>
            <span className="text-[11px] font-bold bg-[#a0efd6] text-[#126b57] px-2.5 py-0.5 rounded-full">
              Edição do Catálogo da ONG
            </span>
            <h2 className="font-['Plus_Jakarta_Sans'] text-2xl sm:text-3xl font-bold text-[#074469] mt-0.5">
              Editar: {name}
            </h2>
          </div>
        </div>

        {/* Abas Internas */}
        <div className="flex bg-[#eceef0] p-1 rounded-2xl mb-5 text-xs font-bold font-['Be_Vietnam_Pro']">
          <button
            type="button"
            onClick={() => setActiveTab('dados')}
            className={`flex-1 py-2 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'dados' ? 'bg-[#074469] text-white shadow-xs' : 'text-[#41474e] hover:text-[#074469]'
            }`}
          >
            <span className="material-symbols-outlined text-sm">edit_document</span>
            <span>Informações</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('fotos')}
            className={`flex-1 py-2 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'fotos' ? 'bg-[#074469] text-white shadow-xs' : 'text-[#41474e] hover:text-[#074469]'
            }`}
          >
            <span className="material-symbols-outlined text-sm">photo_library</span>
            <span>Galeria de Fotos ({1 + galleryImages.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('historico')}
            className={`flex-1 py-2 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'historico' ? 'bg-[#074469] text-white shadow-xs' : 'text-[#41474e] hover:text-[#074469]'
            }`}
          >
            <span className="material-symbols-outlined text-sm">history</span>
            <span>Histórico ({pet.adoptionHistory?.length || 0})</span>
          </button>
        </div>

        {/* ABA 1: DADOS */}
        {activeTab === 'dados' && (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#41474e] mb-1">Nome do Pet *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#f2f4f6] border border-[#c1c7cf] rounded-xl p-2.5 outline-none focus:border-[#074469] focus:bg-white text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#41474e] mb-1">Espécie *</label>
                <select
                  value={species}
                  onChange={(e) => setSpecies(e.target.value as Species)}
                  className="w-full bg-[#f2f4f6] border border-[#c1c7cf] rounded-xl p-2.5 outline-none focus:border-[#074469] focus:bg-white text-xs cursor-pointer"
                >
                  <option value="Cachorro">Cachorro</option>
                  <option value="Gato">Gato</option>
                  <option value="Outro">Outro</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#41474e] mb-1">Idade *</label>
                <input
                  type="text"
                  required
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="Ex: 2 anos, 5 meses"
                  className="w-full bg-[#f2f4f6] border border-[#c1c7cf] rounded-xl p-2.5 outline-none focus:border-[#074469] focus:bg-white text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#41474e] mb-1">Faixa Etária</label>
                <select
                  value={ageGroup}
                  onChange={(e) => setAgeGroup(e.target.value as AgeGroup)}
                  className="w-full bg-[#f2f4f6] border border-[#c1c7cf] rounded-xl p-2.5 outline-none focus:border-[#074469] focus:bg-white text-xs cursor-pointer"
                >
                  <option value="Filhote">Filhote</option>
                  <option value="Adulto">Adulto</option>
                  <option value="Idoso">Idoso</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#41474e] mb-1">Porte *</label>
                <select
                  value={size}
                  onChange={(e) => setSize(e.target.value as Size)}
                  className="w-full bg-[#f2f4f6] border border-[#c1c7cf] rounded-xl p-2.5 outline-none focus:border-[#074469] focus:bg-white text-xs cursor-pointer"
                >
                  <option value="Pequeno">Pequeno (até 10kg)</option>
                  <option value="Médio">Médio (10kg a 25kg)</option>
                  <option value="Grande">Grande (acima de 25kg)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#41474e] mb-1">Gênero *</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as Gender)}
                  className="w-full bg-[#f2f4f6] border border-[#c1c7cf] rounded-xl p-2.5 outline-none focus:border-[#074469] focus:bg-white text-xs cursor-pointer"
                >
                  <option value="Macho">Macho</option>
                  <option value="Fêmea">Fêmea</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#41474e] mb-1">Status no Catálogo *</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full bg-[#f2f4f6] border border-[#c1c7cf] rounded-xl p-2.5 outline-none focus:border-[#074469] focus:bg-white text-xs font-bold text-[#074469] cursor-pointer"
                >
                  <option value="Disponível">Disponível para Adoção</option>
                  <option value="Em Processo">Em Processo / Triagem</option>
                  <option value="Adotado">Adotado ✓</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#41474e] mb-1">Raça / Mistura</label>
                <input
                  type="text"
                  value={breed}
                  onChange={(e) => setBreed(e.target.value)}
                  placeholder="Ex: SRD, Labrador, Siamês"
                  className="w-full bg-[#f2f4f6] border border-[#c1c7cf] rounded-xl p-2.5 outline-none focus:border-[#074469] focus:bg-white text-xs"
                />
              </div>
            </div>

            {/* Checkboxes de Saúde */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
              <label className="flex items-center gap-2 p-2.5 bg-[#f7f9fb] rounded-xl border border-[#e0e3e5] cursor-pointer">
                <input
                  type="checkbox"
                  checked={vaccinated}
                  onChange={(e) => setVaccinated(e.target.checked)}
                  className="w-4 h-4 accent-[#074469]"
                />
                <span className="text-xs font-semibold">Vacinado</span>
              </label>

              <label className="flex items-center gap-2 p-2.5 bg-[#f7f9fb] rounded-xl border border-[#e0e3e5] cursor-pointer">
                <input
                  type="checkbox"
                  checked={castrated}
                  onChange={(e) => setCastrated(e.target.checked)}
                  className="w-4 h-4 accent-[#074469]"
                />
                <span className="text-xs font-semibold">Castrado</span>
              </label>

              <label className="flex items-center gap-2 p-2.5 bg-[#f7f9fb] rounded-xl border border-[#e0e3e5] cursor-pointer">
                <input
                  type="checkbox"
                  checked={dewormed}
                  onChange={(e) => setDewormed(e.target.checked)}
                  className="w-4 h-4 accent-[#074469]"
                />
                <span className="text-xs font-semibold">Vermifugado</span>
              </label>

              <label className="flex items-center gap-2 p-2.5 bg-[#f7f9fb] rounded-xl border border-[#e0e3e5] cursor-pointer">
                <input
                  type="checkbox"
                  checked={specialNeeds}
                  onChange={(e) => setSpecialNeeds(e.target.checked)}
                  className="w-4 h-4 accent-[#074469]"
                />
                <span className="text-xs font-semibold">Cuidados Esp.</span>
              </label>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#41474e] mb-1">
                História & Descrição do Animal
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Conte a história do resgate, temperamento, convivência com outros pets e rotina..."
                className="w-full bg-[#f2f4f6] border border-[#c1c7cf] rounded-xl p-2.5 outline-none focus:border-[#074469] focus:bg-white text-xs resize-none"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-[#e0e3e5]">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 text-[#41474e] text-xs font-semibold hover:bg-[#e0e3e5] rounded-xl cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="bg-[#074469] hover:bg-[#2a5c82] text-white font-bold text-xs px-7 py-2.5 rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                Salvar Alterações
              </button>
            </div>
          </form>
        )}

        {/* ABA 2: GALERIA DE FOTOS MULTIPLAS */}
        {activeTab === 'fotos' && (
          <div className="space-y-5 text-xs sm:text-sm">
            {/* Upload e Inserção de URL */}
            <div className="bg-[#f7f9fb] p-4 rounded-2xl border border-[#e0e3e5] space-y-3">
              <label className="block text-xs font-bold text-[#074469]">
                Adicionar Fotos à Galeria do Pet
              </label>

              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="url"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  placeholder="Cole a URL da imagem (https://...)"
                  className="flex-1 bg-white border border-[#c1c7cf] rounded-xl p-2 text-xs outline-none focus:border-[#074469]"
                />
                <button
                  type="button"
                  onClick={handleAddImageUrl}
                  className="bg-[#074469] text-white font-bold px-4 py-2 rounded-xl text-xs hover:bg-[#2a5c82] transition-colors cursor-pointer shrink-0"
                >
                  + Adicionar URL
                </button>
              </div>

              <div className="flex items-center gap-3">
                <label className="bg-white hover:bg-[#e0e3e5] text-[#074469] border border-[#074469]/30 font-bold px-4 py-2 rounded-xl text-xs cursor-pointer flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-base">upload_file</span>
                  <span>Upload do Computador (Múltiplas Fotos)</span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
                <span className="text-[11px] text-[#72787f]">Selecione uma ou mais fotos</span>
              </div>
            </div>

            {/* Foto Principal */}
            <div>
              <span className="block text-xs font-bold text-[#074469] mb-2">Foto Principal de Capa</span>
              <div className="relative rounded-2xl overflow-hidden border-2 border-[#074469] max-h-56 bg-black/5 flex items-center justify-center">
                <img
                  src={mainImage}
                  alt="Foto principal"
                  className="w-full h-56 object-cover"
                />
                <span className="absolute top-2 left-2 bg-[#074469] text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-xs">
                  Foto de Capa Principal
                </span>
              </div>
            </div>

            {/* Galeria Secundária */}
            <div>
              <span className="block text-xs font-bold text-[#41474e] mb-2">
                Fotos Secundárias ({galleryImages.length})
              </span>

              {galleryImages.length === 0 ? (
                <div className="text-center py-6 bg-[#f7f9fb] rounded-2xl border border-[#e0e3e5] text-[#72787f] text-xs">
                  Nenhuma foto adicional cadastrada. Adicione fotos acima para enriquecer o perfil do pet!
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {galleryImages.map((img, idx) => (
                    <div
                      key={`gallery-thumb-${idx}`}
                      className="group relative rounded-xl overflow-hidden border border-[#e0e3e5] bg-black/5 aspect-square"
                    >
                      <img
                        src={img}
                        alt={`Foto ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1.5 p-2">
                        <button
                          type="button"
                          onClick={() => handleSetAsMain(img, idx)}
                          className="bg-white hover:bg-[#074469] hover:text-white text-[#074469] text-[10px] font-bold px-2.5 py-1 rounded-lg transition-colors cursor-pointer shadow-xs"
                        >
                          Definir Capa
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveGalleryImage(idx)}
                          className="bg-[#ffdad6] hover:bg-[#ba1a1a] hover:text-white text-[#ba1a1a] text-[10px] font-bold px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                        >
                          Remover
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-[#e0e3e5]">
              <button
                type="button"
                onClick={() => setActiveTab('dados')}
                className="bg-[#074469] text-white font-bold text-xs px-6 py-2.5 rounded-xl cursor-pointer"
              >
                Voltar aos Dados
              </button>
            </div>
          </div>
        )}

        {/* ABA 3: HISTÓRICO DE ADOÇÃO VINCULADO */}
        {activeTab === 'historico' && (
          <div className="space-y-4 text-xs sm:text-sm">
            <h3 className="text-xs font-bold text-[#074469] uppercase tracking-wider font-['Plus_Jakarta_Sans']">
              Linha do Tempo e Histórico do Animal
            </h3>

            {(!pet.adoptionHistory || pet.adoptionHistory.length === 0) ? (
              <div className="p-8 text-center bg-[#f7f9fb] rounded-2xl border border-[#e0e3e5]">
                <span className="material-symbols-outlined text-[#72787f] text-3xl mb-1">history</span>
                <p className="text-xs text-[#72787f]">
                  Cadastrado na ONG em {pet.entryDate || 'data recente'}.
                </p>
              </div>
            ) : (
              <div className="relative pl-6 space-y-4 border-l-2 border-[#074469]/20 ml-2">
                {pet.adoptionHistory.map((item) => (
                  <div key={item.id} className="relative">
                    <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-[#074469] border-2 border-white shadow-xs" />
                    <div className="bg-[#f7f9fb] p-3.5 rounded-xl border border-[#e0e3e5]">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-bold text-xs text-[#074469]">{item.title}</span>
                        <span className="text-[10px] text-[#72787f] font-mono">{item.date}</span>
                      </div>
                      <p className="text-xs text-[#41474e] leading-relaxed">{item.description}</p>
                      {item.actorName && (
                        <span className="text-[10px] text-[#126b57] font-semibold block mt-1">
                          Responsável: {item.actorName}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="flex justify-end gap-3 pt-4 border-t border-[#e0e3e5]">
              <button
                type="button"
                onClick={() => setActiveTab('dados')}
                className="bg-[#074469] text-white font-bold text-xs px-6 py-2.5 rounded-xl cursor-pointer"
              >
                Voltar aos Dados
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
