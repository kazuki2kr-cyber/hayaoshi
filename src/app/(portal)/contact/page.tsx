'use client';

import { useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { CheckCircle, AlertCircle, Loader2, Send } from 'lucide-react';

export default function ContactPage() {
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');

        try {
            await addDoc(collection(db, 'contacts'), {
                ...formData,
                createdAt: serverTimestamp(),
                status: 'unread'
            });
            setStatus('success');
            setFormData({ name: '', email: '', message: '' });
        } catch (error) {
            console.error('Error submitting form:', error);
            setStatus('error');
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-12">
            <header className="space-y-4 border-b border-neutral-800 pb-8">
                <h1 className="text-3xl md:text-4xl font-bold text-white">お問い合わせ</h1>
                <p className="text-neutral-400">ご質問・ご要望などがございましたら、お気軽にお問い合わせください。</p>
            </header>

            {status === 'success' ? (
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-8 text-center space-y-4">
                    <div className="bg-emerald-500/20 p-4 rounded-full inline-block">
                        <CheckCircle className="w-12 h-12 text-emerald-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-white">送信完了</h2>
                    <p className="text-neutral-300">
                        お問い合わせありがとうございます。<br />
                        内容を確認次第、担当者よりご連絡させていただきます。
                    </p>
                    <button
                        onClick={() => setStatus('idle')}
                        className="text-emerald-400 hover:text-emerald-300 font-medium mt-4 underline"
                    >
                        他のお問い合わせを送る
                    </button>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label htmlFor="name" className="text-sm font-medium text-neutral-300">
                                お名前 (必須)
                            </label>
                            <input
                                type="text"
                                id="name"
                                required
                                className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-colors"
                                placeholder="例: 山田 太郎"
                                value={formData.name}
                                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="email" className="text-sm font-medium text-neutral-300">
                                メールアドレス (必須)
                            </label>
                            <input
                                type="email"
                                id="email"
                                required
                                className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-colors"
                                placeholder="例: yamada@example.com"
                                value={formData.email}
                                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="message" className="text-sm font-medium text-neutral-300">
                                お問い合わせ内容 (必須)
                            </label>
                            <textarea
                                id="message"
                                required
                                rows={6}
                                className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-colors resize-none"
                                placeholder="お問い合わせ内容をご記入ください"
                                value={formData.message}
                                onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                            />
                        </div>
                    </div>

                    {status === 'error' && (
                        <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400">
                            <AlertCircle className="w-5 h-5 flex-shrink-0" />
                            <p className="text-sm">
                                送信に失敗しました。時間をおいて再度お試しいただくか、直接メールにてお問い合わせください。
                            </p>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={status === 'loading'}
                        className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
                    >
                        {status === 'loading' ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                送信中...
                            </>
                        ) : (
                            <>
                                <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                送信する
                            </>
                        )}
                    </button>

                    <p className="text-xs text-center text-neutral-500">
                        ※お預かりした個人情報は、お問い合わせへの回答のみに使用し、<br className="hidden md:inline" />第三者に提供することはございません。<a href="/privacy" className="underline hover:text-neutral-400">プライバシーポリシー</a>をご確認ください。
                    </p>
                </form>
            )}
        </div>
    );
}
