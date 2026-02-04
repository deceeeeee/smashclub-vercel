import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Link, useNavigate } from "react-router-dom"
import { Eye, EyeOff, Lock, Mail, ArrowRight } from "lucide-react"
import { useState } from "react"
import { cn } from "../../lib/utils"
import { useAuthStore } from "./auth.store"

const loginSchema = z.object({
    email: z.string().email("Email tidak valid"),
    password: z.string().min(1, "Password diperlukan"),
    remember: z.boolean().optional(),
})

type LoginForm = z.infer<typeof loginSchema>

export default function Login() {
    const navigate = useNavigate()
    const { login } = useAuthStore()
    const [showPassword, setShowPassword] = useState(false)

    const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
        resolver: zodResolver(loginSchema)
    })

    const onSubmit = (data: LoginForm) => {
        console.log("Login Data:", data)
        // Mock login success
        login("mock-token", { name: "User", email: data.email })
        navigate("/")
    }

    return (
        <div className="min-h-screen bg-background flex">
            {/* Left Side - Hero (Hidden on mobile) */}
            <div className="hidden lg:flex w-1/2 flex-col justify-center bg-[#08181b] relative overflow-hidden">
                {/* Background Overlay */}
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1554068865-24cecd4e34b8?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-40" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#08181b] via-transparent to-transparent" />

                <div className="relative z-10 p-12 lg:p-24 flex flex-col justify-end h-full">
                    <div className="max-w-md">
                        <h2 className="text-4xl font-bold text-white mb-4">Kembali ke Lapangan</h2>
                        <p className="text-gray-300 text-lg leading-relaxed mb-8">
                            "Tennis bukan sekadar olahraga, ini adalah cara kita terhubung, berkompetisi, dan berkembang bersama."
                        </p>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-[#08181b] font-bold">S</div>
                            <div>
                                <div className="font-bold text-white">SmashClub Community</div>
                                <div className="text-xs text-primary">Est. 2023</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 p-6 md:p-12 lg:p-24 flex flex-col justify-center bg-background">
                <div className="max-w-md mx-auto w-full">
                    <div className="mb-8">
                        <h2 className="text-3xl font-bold text-white mb-2">Selamat Datang Kembali</h2>
                        <p className="text-gray-400">Masuk untuk mengakses jadwal dan komunitas Anda.</p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        <InputGroup error={errors.email?.message}>
                            <label className="block text-sm font-medium text-gray-300 mb-1.5">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                <input
                                    {...register("email")}
                                    type="email"
                                    placeholder="contoh@email.com"
                                    className={cn(
                                        "w-full bg-[#16282a] border border-gray-700 rounded-lg py-3 pl-10 pr-4 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all",
                                        errors.email && "border-red-500 focus:ring-red-500"
                                    )}
                                />
                            </div>
                        </InputGroup>

                        <InputGroup error={errors.password?.message}>
                            <div className="flex justify-between items-center mb-1.5">
                                <label className="block text-sm font-medium text-gray-300">Kata Sandi</label>
                                <a href="#" className="text-xs text-primary hover:underline">Lupa Kata Sandi?</a>
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                <input
                                    {...register("password")}
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Masukkan kata sandi"
                                    className={cn(
                                        "w-full bg-[#16282a] border border-gray-700 rounded-lg py-3 pl-10 pr-10 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all",
                                        errors.password && "border-red-500 focus:ring-red-500"
                                    )}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </InputGroup>

                        <div className="flex items-center gap-3 pt-1">
                            <input
                                {...register("remember")}
                                id="remember"
                                type="checkbox"
                                className="w-4 h-4 rounded border-gray-600 bg-[#16282a] text-primary focus:ring-primary/50"
                            />
                            <label htmlFor="remember" className="text-sm text-gray-400">Inventory saya tetap masuk</label>
                        </div>

                        <button type="submit" className="w-full bg-primary text-background font-bold py-3.5 rounded-lg hover:bg-primary/90 transition-all mt-4 flex items-center justify-center gap-2">
                            Masuk Sekarang
                            <ArrowRight className="w-5 h-5" />
                        </button>
                    </form>

                    <p className="text-center text-gray-400 text-sm mt-8">
                        Belum punya akun? <Link to="/register" className="text-primary font-bold hover:underline">Daftar Sekarang</Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

function InputGroup({ children, error }: { children: React.ReactNode, error?: string }) {
    return (
        <div>
            {children}
            {error && <p className="text-red-500 text-xs mt-1.5 ml-1">{error}</p>}
        </div>
    )
}
