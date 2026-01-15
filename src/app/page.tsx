"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { doc, setDoc, getDoc, collection } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { generateRoomId } from "@/lib/utils-game";
import { LogIn, Plus, Users, Sparkles, Sword } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  const { user, loginWithGoogle } = useAuth();
  const [roomId, setRoomId] = useState("");
  const router = useRouter();

  const handleCreateRoom = async () => {
    if (!user) return;

    let newId = generateRoomId();
    let docRef = doc(db, "rooms", newId);
    let docSnap = await getDoc(docRef);

    while (docSnap.exists()) {
      newId = generateRoomId();
      docRef = doc(db, "rooms", newId);
      docSnap = await getDoc(docRef);
    }

    await setDoc(doc(db, "rooms", newId), {
      status: "waiting",
      currentQuestionIndex: -1,
      currentPhase: "waiting",
      hostId: user.uid,
      hostName: user.displayName || "賢者",
      createdAt: Date.now(),
      shortId: newId
    });

    router.push(`/host/${newId}`);
  };

  const handleJoinRoom = () => {
    if (roomId.length === 6) {
      router.push(`/room/${roomId}`);
    }
  };

  return (
    <main className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden">
      {/* Fantasy Background */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/fantasy-bg.png')", filter: "brightness(0.4) contrast(1.2)" }}
      />
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-transparent via-black/20 to-black/60" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md z-10"
      >
        <Card className="fantasy-card border-none bg-black/40 backdrop-blur-xl">
          <CardHeader className="text-center pb-2">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="inline-block mx-auto mb-4"
            >
              <div className="relative">
                <Sword className="h-12 w-12 text-amber-500 absolute -top-1 -left-1 rotate-[-15deg] opacity-50" />
                <Sparkles className="h-16 w-16 text-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.5)]" />
              </div>
            </motion.div>
            <CardTitle className="text-5xl font-black italic tracking-tighter gold-text uppercase">
              Shibaura Quiz
            </CardTitle>
            <CardDescription className="text-amber-200/70 font-medium text-lg mt-2">
              究極のファンタジー早押しクイズ
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6 pt-6">
            {!user ? (
              <Button
                onClick={loginWithGoogle}
                size="lg"
                className="w-full fantasy-button py-8 text-xl"
              >
                <LogIn className="mr-3 h-6 w-6" /> 冒険を始める（Googleログイン）
              </Button>
            ) : (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
                  <p className="text-amber-100/60 text-sm mb-1 uppercase tracking-widest">Welcome, Hero</p>
                  <p className="text-xl font-bold text-white">{user.displayName} どの</p>
                </div>

                <Button
                  onClick={handleCreateRoom}
                  className="w-full fantasy-button py-7 text-lg group"
                >
                  <Plus className="mr-2 h-5 w-5 transition-transform group-hover:rotate-90" />
                  ギルドを設立する (新規クイズ作成)
                </Button>

                <div className="relative py-4">
                  <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 border-t border-white/10" />
                  <span className="relative bg-[#1a120b] px-3 text-xs text-white/30 uppercase tracking-[0.3em] font-bold block mx-auto w-fit">
                    または
                  </span>
                </div>

                <div className="flex gap-2">
                  <Input
                    placeholder="6桁の召喚コード"
                    value={roomId}
                    onChange={(e) => setRoomId(e.target.value)}
                    maxLength={6}
                    className="h-14 bg-black/40 border-amber-900/50 text-white placeholder:text-white/20 text-center text-xl font-mono tracking-widest focus:border-amber-500 focus:ring-amber-500"
                  />
                  <Button
                    onClick={handleJoinRoom}
                    disabled={roomId.length !== 6}
                    className="h-14 px-6 bg-amber-600 hover:bg-amber-500 text-black font-black disabled:opacity-50 disabled:bg-slate-800"
                  >
                    参戦
                  </Button>
                </div>
              </div>
            )}
          </CardContent>

          <CardFooter className="justify-center border-t border-white/5 pt-6 pb-4">
            <p className="text-white/20 text-[10px] uppercase tracking-[0.5em] font-black">
              © 2026 Shibaura Quiz. All rights reserved.
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </main>
  );
}
