import { ArrowLeft, Image as ImageIcon, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../features/auth/auth.store';
import { useState, useRef } from 'react';

export default function EditProfilePage() {
    const navigate = useNavigate();
    const { user, updateUser } = useAuthStore();
    const [previewImage, setPreviewImage] = useState<string | null>(user?.avatar || null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = () => {
        setPreviewImage(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleSave = () => {
        updateUser({ avatar: previewImage });
        navigate(-1);
    };

    return (
        <div className="min-h-screen bg-background text-white font-sans pb-20">
            {/* Header */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
                <div className="relative flex items-center justify-center">
                    <button
                        onClick={() => navigate(-1)}
                        className="absolute left-0 flex items-center gap-2 text-gray-400 hover:text-white transition-colors group"
                    >
                        <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                        <span className="font-medium">Kembali</span>
                    </button>
                    <h1 className="text-3xl font-extrabold tracking-tight">Edit Profil</h1>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
                <div className="bg-[#0a1618] border border-white/5 rounded-[40px] p-16 flex flex-col items-center justify-center shadow-2xl relative overflow-hidden group/card">
                    {/* Subtle glow effect */}
                    <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 blur-[100px] rounded-full" />
                    <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-primary/5 blur-[100px] rounded-full" />

                    <div className="relative">
                        <div className="w-56 h-56 rounded-[40px] overflow-hidden bg-gray-900 border-2 border-white/5 shadow-2xl flex items-center justify-center transition-transform duration-500 group-hover/card:scale-[1.02]">
                            {previewImage ? (
                                <img src={previewImage} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <div className="text-gray-500 flex flex-col items-center">
                                    <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-4">
                                        <ImageIcon className="w-10 h-10 opacity-40" />
                                    </div>
                                    <span className="text-sm font-medium opacity-40 uppercase tracking-widest">No Photo</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-wrap justify-center gap-6 mt-12">
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleImageChange}
                            className="hidden"
                            accept="image/*"
                        />
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="flex items-center gap-3 bg-[#112426] hover:bg-[#183236] text-white px-8 py-4 rounded-2xl font-bold transition-all border border-white/5 hover:scale-105 active:scale-95 shadow-lg"
                        >
                            <ImageIcon className="w-5 h-5 text-primary" />
                            Ubah Foto
                        </button>
                        <button
                            onClick={handleRemoveImage}
                            className="flex items-center gap-3 bg-[#112426] hover:bg-red-500/10 text-red-500 px-8 py-4 rounded-2xl font-bold transition-all border border-red-500/10 hover:border-red-500/30 hover:scale-105 active:scale-95 shadow-lg"
                        >
                            <Trash2 className="w-5 h-5" />
                            Hapus Foto
                        </button>
                    </div>
                </div>

                <div className="flex justify-end gap-6 mt-10">
                    <button
                        onClick={() => navigate(-1)}
                        className="px-12 py-5 rounded-2xl border border-white/10 text-gray-400 hover:text-white font-bold hover:bg-white/5 transition-all active:scale-95"
                    >
                        Batalkan
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-12 py-5 rounded-2xl bg-primary text-background font-bold hover:brightness-110 transition-all active:scale-95 shadow-[0_0_30px_rgba(0,214,181,0.2)] hover:shadow-[0_0_40px_rgba(0,214,181,0.4)]"
                    >
                        Simpan Perubahan
                    </button>
                </div>
            </div>
        </div>
    );
}
