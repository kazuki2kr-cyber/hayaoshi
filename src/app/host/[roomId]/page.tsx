"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { doc, onSnapshot, collection, updateDoc, getDocs, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Settings, Play, ChevronRight, Copy, Share2, Crown, ScrollText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";

interface Player {
    id: string;
    name: string;
    iconUrl: string;
    joinedAt: number;
}

export default function HostDashboard() {
    const { roomId } = useParams() as { roomId: string };
    const { user, loading: authLoading } = useAuth();
    const [players, setPlayers] = useState<Player[]>([]);
    const [roomStatus, setRoomStatus] = useState<string>("waiting");
    const [hostName, setHostName] = useState<string>("");
    const { toast } = useToast();
    const router = useRouter();

    useEffect(() => {
        if (authLoading || !user) return;

        const roomRef = doc(db, "rooms", roomId);
        const unsubscribeRoom = onSnapshot(roomRef, (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.data();
                if (data.hostId !== user.uid) {
                    router.push("/");
                    return;
                }
                setRoomStatus(data.status);
                setHostName(data.hostName);
            } else {
                router.push("/");
            }
        });

        const playersRef = collection(db, "rooms", roomId, "players");
        const unsubscribePlayers = onSnapshot(playersRef, (snapshot) => {
            setPlayers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Player)));
        });

        return () => {
            unsubscribeRoom();
            unsubscribePlayers();
        };
    }, [roomId, user, authLoading, router]);

    const handleCopyInvite = () => {
        const url = `${window.location.origin}/room/${roomId}`;
        navigator.clipboard.writeText(url);
        toast({
            title: "召喚コードをコピーしました",
            description: "冒険者たちにこのURLを共有してください！",
        });
    };

    const handleStartGame = async () => {
        if (players.length === 0) {
            toast({
                title: "冒険者がいません",
                description: "少なくとも一人のプレイヤーが参加する必要があります。",
                variant: "destructive",
            });
            return;
        }

        await updateDoc(doc(db, "rooms", roomId), {
            status: "playing",
            currentQuestionIndex: 0,
            currentPhase: "question",
            startTime: Date.now(),
        });

        router.push(`/host/${roomId}/play`);
    };

    if (!user) return null;

    return (
        <div className="min-h-screen relative bg-slate-950 text-white p-4 md:p-8 overflow-hidden">
            {/* Redesigned Host Layout */}
            <div className="absolute inset-0 bg-[url('/fantasy-bg.png')] bg-cover bg-center mix-blend-overlay opacity-20 pointer-events-none" />

            <div className="max-w-5xl mx-auto space-y-8 relative z-10">
                <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-amber-900/30 pb-8">
                    <div className="space-y-2">
                        <div className="flex items-center gap-3">
                            <Crown className="h-8 w-8 text-amber-500 animate-pulse" />
                            <h1 className="text-4xl font-black gold-text italic tracking-tight">管理ギルド本部</h1>
                        </div>
                        <p className="text-amber-200/50 font-medium">ルームを管理し、冒険を導きましょう</p>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="bg-black/40 border border-amber-900/50 rounded-2xl p-4 flex items-center gap-4 backdrop-blur-md">
                            <div>
                                <p className="rpg-label">召喚コード</p>
                                <p className="text-3xl font-black font-mono tracking-tighter text-amber-400">{roomId}</p>
                            </div>
                            <Button variant="ghost" size="icon" onClick={handleCopyInvite} className="hover:bg-amber-900/20 text-amber-400">
                                <Copy className="h-6 w-6" />
                            </Button>
                        </div>
                        <Button onClick={handleStartGame} size="lg" className="h-20 px-10 rounded-2xl bg-amber-600 hover:bg-amber-500 text-black font-black text-xl shadow-xl shadow-amber-900/20 group">
                            冒険を開始する <Play className="ml-2 fill-current group-hover:scale-125 transition-transform" />
                        </Button>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        {/* Status Card */}
                        <Card className="fantasy-card border-none">
                            <CardHeader>
                                <div className="flex justify-between items-center">
                                    <CardTitle className="text-2xl font-bold flex items-center gap-2">
                                        <ScrollText className="h-6 w-6 text-amber-500" />
                                        現在のステータス
                                    </CardTitle>
                                    <Badge variant="outline" className="px-4 py-1 border-amber-500 text-amber-400 font-bold uppercase tracking-widest">
                                        {roomStatus === "waiting" ? "待機中" : "進行中"}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 rounded-xl bg-black/30 border border-white/5">
                                        <p className="rpg-label">マスター</p>
                                        <p className="text-xl font-bold">{hostName || "伝説の賢者"}</p>
                                    </div>
                                    <div className="p-4 rounded-xl bg-black/30 border border-white/5">
                                        <p className="rpg-label">現在のフェーズ</p>
                                        <p className="text-xl font-bold">{roomStatus === "waiting" ? "冒険者募集中" : "試練遂行中"}</p>
                                    </div>
                                </div>
                                <Button onClick={() => router.push(`/host/${roomId}/edit`)} variant="outline" className="w-full h-14 border-amber-900/50 hover:bg-amber-900/20 text-amber-200">
                                    <Settings className="mr-2 h-5 w-5" /> 試練の内容を編集する (問題管理)
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Players Section */}
                        <div className="space-y-4">
                            <h2 className="text-2xl font-black italic gold-text flex items-center gap-3">
                                <Users className="h-7 w-7" />
                                参加中の冒険者 ({players.length})
                            </h2>
                            {players.length === 0 ? (
                                <div className="h-64 flex flex-col items-center justify-center border-2 border-dashed border-amber-900/30 rounded-3xl bg-black/10">
                                    <Users className="h-16 w-16 text-amber-900/30 mb-4" />
                                    <p className="text-amber-200/30 font-bold">扉は開かれています。冒険者の到来を待ちましょう...</p>
                                    <Button variant="link" onClick={handleCopyInvite} className="text-amber-500 font-bold mt-2">招待リンクを共有</Button>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                    <AnimatePresence>
                                        {players.map((player) => (
                                            <motion.div
                                                key={player.id}
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.8 }}
                                                className="p-4 rounded-2xl bg-black/50 border border-amber-900/40 flex items-center gap-4 group hover:border-amber-500 transition-colors"
                                            >
                                                <div className="relative">
                                                    <img src={player.iconUrl} className="w-12 h-12 rounded-full border-2 border-amber-500/50" alt="" />
                                                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-black" />
                                                </div>
                                                <div className="truncate">
                                                    <p className="font-black text-amber-100 group-hover:text-white transition-colors capitalize">{player.name}</p>
                                                    <p className="text-[10px] text-amber-500/50 font-bold tracking-widest uppercase">Lv.1 Adventurer</p>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="space-y-8">
                        <Card className="fantasy-card border-none h-full">
                            <CardHeader>
                                <CardTitle className="text-xl font-bold flex items-center gap-2">
                                    魔法のスクロール
                                </CardTitle>
                                <CardDescription>ギルドマスターの心得</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4 text-sm text-amber-100/60 leading-relaxed italic">
                                <p>1. クイズの内容はいつでも「試練の内容を編集」から変更可能です。</p>
                                <p>2. 各問題には制限時間と配点が設定できます。難しい問題ほど多くの戦利品（ポイント）が得られるようにしましょう。</p>
                                <p>3. 全員の準備ができたら「冒険を開始する」を押してください。</p>
                                <div className="pt-4 mt-4 border-t border-white/10">
                                    <p className="font-bold text-amber-400 mb-2 underline tracking-widest uppercase text-xs">Guild Secret</p>
                                    <p>解答スピードが速いほど、追加のボーナスが得られます。反射神経こそが勝利の鍵です。</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
