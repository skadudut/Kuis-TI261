import { useState, useMemo, useEffect, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";
import {
  Lock,
  CheckCircle2,
  LogOut,
  Users,
  ChevronRight,
  X,
  ShieldCheck,
  AlertCircle,
  BarChart3,
  Award,
  BookOpen,
  ArrowLeft,
  CircleCheck,
  CircleX,
  Trash2,
  KeyRound,
  PieChart,
  RefreshCw,
  Database,
  CloudOff,
} from "lucide-react";

// ─── KONFIGURASI SUPABASE CLIENT ──────────────────────────────────────────────
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

// ─── DATA SOAL (10 BANK SOAL) ─────────────────────────────────────────────────
const QUESTIONS = [
  {
    id: 1,
    question:
      "Perangkat keras manakah yang berfungsi sebagai pemroses utama (otak) dari sebuah sistem komputer?",
    options: ["Harddisk", "RAM", "Processor (CPU)", "Power Supply"],
    answer: "Processor (CPU)",
  },
  {
    id: 2,
    question:
      "Apa langkah awal yang paling tepat dalam merancang program komputer untuk menyelesaikan masalah?",
    options: [
      "Langsung mengetik coding",
      "Memahami masalah dan membuat rancangan alur (Algoritma/Pseudocode)",
      "Membeli server baru",
      "Menginstal sistem operasi",
    ],
    answer:
      "Memahami masalah dan membuat rancangan alur (Algoritma/Pseudocode)",
  },
  {
    id: 3,
    question:
      "Jika variabel A = true dan B = false, berapakah hasil dari operasi logika A AND B?",
    options: ["True", "False", "Null", "Error"],
    answer: "False",
  },
  {
    id: 4,
    question:
      "Perintah percabangan yang digunakan untuk memilih salah satu dari dua kondisi (jika benar jalankan A, jika salah jalankan B) adalah...",
    options: ["For... Loop", "If... Else", "Print... Format", "Scanf"],
    answer: "If... Else",
  },
  {
    id: 5,
    question:
      "Apa fungsi utama dari struktur perulangan (loop) dalam bahasa pemrograman?",
    options: [
      "Menghentikan program selamanya",
      "Menjalankan blok kode secara berulang selama kondisi tertentu terpenuhi",
      "Menghapus data otomatis dari memori",
      "Menyimpan file ke database",
    ],
    answer:
      "Menjalankan blok kode secara berulang selama kondisi tertentu terpenuhi",
  },
  {
    id: 6,
    question:
      "Perangkat jaringan yang bertugas menghubungkan beberapa komputer dalam satu jaringan lokal (LAN) adalah...",
    options: [
      "Switch / Hub",
      "Satelit komunikasi",
      "Bluetooth mouse",
      "Proyektor",
    ],
    answer: "Switch / Hub",
  },
  {
    id: 7,
    question:
      "Sistem bilangan berbasis dua yang hanya mengenali angka 0 dan 1 dalam sistem komputer dinamakan...",
    options: ["Desimal", "Oktal", "Hexadesimal", "Biner"],
    answer: "Biner",
  },
  {
    id: 8,
    question:
      "Proses mendeteksi, melacak, dan memperbaiki kesalahan atau bug pada baris kode program disebut...",
    options: ["Compiling", "Debugging", "Formatting", "Upgrading"],
    answer: "Debugging",
  },
  {
    id: 9,
    question:
      "Perangkat lunak yang bertindak sebagai jembatan antara perangkat keras (hardware) dan pengguna (user) adalah...",
    options: [
      "Microsoft Word",
      "Sistem Operasi (Operating System)",
      "Google Chrome",
      "Antivirus",
    ],
    answer: "Sistem Operasi (Operating System)",
  },
  {
    id: 10,
    question:
      "Representasi visual atau diagram alir yang menggambarkan langkah-langkah penyelesaian suatu masalah secara urut dinamakan...",
    options: ["Flowchart", "Database", "Bytecode", "Wireframe"],
    answer: "Flowchart",
  },
];

// ─── SHUFFLE ALGORITHM (Fisher–Yates) ─────────────────────────────────────────
function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ─── GRADE HELPER & DESKRIPSI SPESIFIK ────────────────────────────────────────
function getGrade(correct) {
  if (correct >= 9)
    return {
      letter: "A",
      emoji: "🌟",
      color: "text-emerald-600",
      bg: "bg-emerald-500/15",
      border: "border-emerald-500",
      description:
        "Luar biasa! Penguasaan materimu sudah sangat matang. Pertahankan konsistensi belajarmu dan jadilah inspirasi bagi teman sekelas!",
    };
  if (correct >= 7)
    return {
      letter: "B",
      emoji: "👍",
      color: "text-blue-600",
      bg: "bg-blue-500/15",
      border: "border-blue-500",
      description:
        "Kerja bagus! Sebagian besar materi sudah kamu kuasai dengan baik. Sedikit ketelitian lagi, dan kamu pasti bisa meraih hasil sempurna!",
    };
  if (correct >= 5)
    return {
      letter: "C",
      emoji: "💪",
      color: "text-amber-600",
      bg: "bg-amber-500/15",
      border: "border-amber-500",
      description:
        "Usaha yang bagus! Jadikan jawaban yang keliru sebagai panduan untuk membaca ulang materi yang masih perlu diperkuat.",
    };
  if (correct >= 3)
    return {
      letter: "D",
      emoji: "📚",
      color: "text-orange-600",
      bg: "bg-orange-500/15",
      border: "border-orange-500",
      description:
        "Jangan menyerah! Ayo luangkan waktu untuk mengulas kembali modul kuliah dan berdiskusi. Kamu pasti bisa mengejar ketertinggalan!",
    };
  return {
    letter: "E",
    emoji: "✨",
    color: "text-rose-500",
    bg: "bg-rose-500/15",
    border: "border-rose-500",
    description:
      "Tetap semangat! Setiap ahli teknologi hebat pernah berada di titik awal. Mari mulai bangun fondasi logikamu dari nol dengan sabar!",
  };
}

// ─── ANIMATED GRADIENT BG WITH FLOATING BLOBS ────────────────────────────────
function GradientBg() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-gradient-to-br from-indigo-100 via-white to-cyan-100">
      <div
        className="animate-blob-1 absolute -top-24 -left-24 h-[520px] w-[520px] rounded-full opacity-50 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(168,130,255,0.7) 0%, rgba(168,130,255,0) 70%)",
        }}
      />
      <div
        className="animate-blob-2 absolute top-1/4 right-0 h-[480px] w-[480px] rounded-full opacity-45 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(110,190,255,0.7) 0%, rgba(110,190,255,0) 70%)",
        }}
      />
      <div
        className="animate-blob-3 absolute -bottom-32 left-1/4 h-[500px] w-[500px] rounded-full opacity-50 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(80,220,210,0.65) 0%, rgba(80,220,210,0) 70%)",
        }}
      />
      <div
        className="animate-blob-4 absolute top-2/3 right-1/4 h-[400px] w-[400px] rounded-full opacity-40 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(255,160,200,0.6) 0%, rgba(255,160,200,0) 70%)",
        }}
      />
    </div>
  );
}

// ─── SOAL CARD ────────────────────────────────────────────────────────────────
function QuestionCard({
  q,
  displayIndex,
  shuffledOptions,
  selected,
  onSelect,
}) {
  return (
    <div className="relative z-10 flex flex-col gap-4 rounded-2xl border border-white/50 bg-white/50 p-5 shadow-lg backdrop-blur-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl">
      <div>
        <span className="mb-1 block text-xs font-bold text-blue-300">
          {String(displayIndex).padStart(2, "0")}
        </span>
        <p className="text-sm font-semibold leading-relaxed text-slate-800">
          {q.question}
        </p>
      </div>
      <div className="flex flex-col gap-2">
        {shuffledOptions.map((opt) => {
          const isSelected = selected === opt;
          return (
            <button
              key={opt}
              onClick={() => onSelect(q.id, opt)}
              className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-2.5 text-left text-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-md ${
                isSelected
                  ? "border-blue-500 bg-blue-500/20 text-blue-900 shadow-md font-medium"
                  : "border-white/60 bg-white/40 text-slate-700 backdrop-blur-sm hover:border-blue-300 hover:bg-white/60"
              }`}
            >
              <span
                className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-300 ${
                  isSelected
                    ? "border-blue-500 bg-blue-500"
                    : "border-slate-300 bg-white/70"
                }`}
              >
                {isSelected && (
                  <span className="h-1.5 w-1.5 rounded-full bg-white" />
                )}
              </span>
              <span>{opt}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── ANSWER KEY CARD ──────────────────────────────────────────────────────────
function AnswerKeyCard({ q, index, userAnswer }) {
  const isCorrect = userAnswer === q.answer;
  return (
    <div
      className={`relative z-10 flex flex-col gap-4 rounded-2xl border p-5 shadow-lg backdrop-blur-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl ${
        isCorrect
          ? "border-emerald-300/60 bg-emerald-50/50"
          : "border-red-300/60 bg-red-50/40"
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="block text-xs font-bold text-blue-300">
          {String(index + 1).padStart(2, "0")}
        </span>
        {isCorrect ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
            <CircleCheck size={11} /> Benar
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 rounded-full bg-red-500/15 px-2 py-0.5 text-[10px] font-bold text-red-600">
            <CircleX size={11} /> Salah
          </span>
        )}
      </div>
      <p className="text-sm font-semibold leading-relaxed text-slate-800">
        {q.question}
      </p>
      <div className="flex flex-col gap-2">
        {q.options.map((opt) => {
          const isAnswer = opt === q.answer;
          const isUserPick = opt === userAnswer;
          const isWrongPick = isUserPick && !isCorrect;
          let classes =
            "flex items-center gap-3 rounded-xl border px-4 py-2.5 text-left text-sm transition-all duration-300";
          if (isAnswer) {
            classes +=
              " border-emerald-500 bg-emerald-500/20 text-emerald-900 font-medium";
          } else if (isWrongPick) {
            classes +=
              " border-red-400 bg-red-500/15 text-red-800 line-through opacity-80";
          } else {
            classes +=
              " border-white/60 bg-white/30 text-slate-500 backdrop-blur-sm";
          }
          return (
            <div key={opt} className={classes}>
              <span
                className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 ${
                  isAnswer
                    ? "border-emerald-500 bg-emerald-500"
                    : isWrongPick
                      ? "border-red-400 bg-red-400"
                      : "border-slate-300 bg-white/50"
                }`}
              >
                {isAnswer && <CheckCircle2 size={10} className="text-white" />}
                {isWrongPick && <X size={10} className="text-white" />}
              </span>
              <span className="flex-1">{opt}</span>
              {isAnswer && (
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">
                  Jawaban
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── HALAMAN KUNCI JAWABAN ────────────────────────────────────────────────────
function AnswerKeyPage({ questions, answers, correct, total, onClose }) {
  const grade = getGrade(correct);
  return (
    <div className="relative min-h-screen">
      <GradientBg />
      <header className="sticky top-0 z-30 border-b border-white/40 bg-white/40 backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <BookOpen size={18} className="text-slate-600" />
            <div>
              <h1 className="text-sm font-bold text-slate-800">
                Kunci Jawaban
              </h1>
              <p className="text-xs text-slate-500">
                Skor {grade.letter} &bull; {correct}/{total} Benar
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 rounded-xl border border-white/60 bg-white/50 px-4 py-2 text-xs font-semibold text-slate-600 shadow-sm backdrop-blur-sm transition-all duration-300 hover:bg-white/80 hover:shadow-md"
          >
            <ArrowLeft size={14} /> Kembali
          </button>
        </div>
      </header>
      <div className="mx-auto mt-6 max-w-5xl px-4">
        <div className="relative z-10 flex flex-wrap items-center gap-4 rounded-2xl border border-white/50 bg-white/50 px-6 py-4 shadow-lg backdrop-blur-lg">
          <div className="flex items-center gap-2">
            <CircleCheck size={16} className="text-emerald-500" />
            <span className="text-sm text-slate-700">
              <span className="font-bold text-emerald-600">{correct}</span>{" "}
              Benar
            </span>
          </div>
          <div className="h-4 w-px bg-slate-200" />
          <div className="flex items-center gap-2">
            <CircleX size={16} className="text-red-400" />
            <span className="text-sm text-slate-700">
              <span className="font-bold text-red-500">{total - correct}</span>{" "}
              Salah
            </span>
          </div>
          <div className="h-4 w-px bg-slate-200" />
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold backdrop-blur-sm ${grade.bg} ${grade.color}`}
          >
            Skor {grade.letter}
          </span>
        </div>
      </div>
      <main className="mx-auto max-w-5xl px-4 py-6 pb-16">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {questions.map((q, i) => (
            <AnswerKeyCard
              key={q.id}
              q={q}
              index={i}
              userAnswer={answers[q.id]}
            />
          ))}
        </div>
      </main>
    </div>
  );
}

// ─── MODAL ADMIN LOGIN (PASSWORD: buburdiaduk123) ──────────────────────────────
function AdminLoginModal({ onClose, onSuccess }) {
  const [pw, setPw] = useState("");
  const [err, setErr] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (pw === "buburdiaduk123") {
      onSuccess();
    } else {
      setErr(true);
      setPw("");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="relative z-10 w-full max-w-sm rounded-2xl border border-white/50 bg-white/60 p-8 shadow-2xl backdrop-blur-xl">
        <div className="mb-6 flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-slate-800 to-slate-600 shadow-lg">
            <ShieldCheck size={20} className="text-white" />
          </span>
          <div>
            <h2 className="text-base font-bold text-slate-800">Akses Admin</h2>
            <p className="text-xs text-slate-500">
              Masukkan kata sandi untuk melanjutkan
            </p>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="relative">
            <KeyRound
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              autoFocus
              type="password"
              placeholder="Kata sandi admin"
              value={pw}
              onChange={(e) => {
                setPw(e.target.value);
                setErr(false);
              }}
              className={`w-full rounded-xl border bg-white/50 py-2.5 pl-10 pr-4 text-sm text-slate-800 outline-none backdrop-blur-sm transition-all focus:ring-2 focus:ring-blue-300 ${
                err ? "border-red-400 focus:ring-red-200" : "border-white/60"
              }`}
            />
          </div>
          {err && (
            <p className="flex items-center gap-1.5 text-xs text-red-500">
              <AlertCircle size={12} /> Kata sandi salah. Akses ditolak.
            </p>
          )}
          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-white/60 bg-white/40 py-2.5 text-sm font-medium text-slate-600 backdrop-blur-sm transition-all duration-300 hover:bg-white/70"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex-1 rounded-xl bg-gradient-to-r from-slate-800 to-slate-700 py-2.5 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-xl"
            >
              Masuk
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── HALAMAN WELCOME (ANONIM) ─────────────────────────────────────────────────
function WelcomePage({ onStart, onAdminClick }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <GradientBg />
      {/* Ikon Gembok Tersembunyi di Sudut Kanan Atas */}
      <button
        onClick={onAdminClick}
        title="Admin"
        className="absolute right-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-xl text-slate-300/60 transition-all duration-300 hover:bg-white/30 hover:text-slate-500"
      >
        <Lock size={15} />
      </button>

      <div className="relative z-10 w-full max-w-sm rounded-3xl border border-white/50 bg-white/50 px-8 py-10 shadow-2xl backdrop-blur-xl">
        <div className="mb-7 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-800 to-slate-600 shadow-lg">
            <CheckCircle2 size={28} className="text-white" />
          </div>
          <h1 className="text-xl font-bold text-slate-800">
            Kuis Riset Mahasiswa IT
          </h1>
          <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-slate-500">
            Uji pemahaman dasar Anda pada bidang Informatika. Kuis terdiri dari
            10 pertanyaan pilihan ganda.
          </p>
        </div>
        <button
          onClick={onStart}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-slate-800 to-slate-700 py-3.5 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-xl"
        >
          Mulai Kuis <ChevronRight size={16} />
        </button>
        <p className="mt-5 text-center text-[11px] leading-relaxed text-slate-400">
          Kuis ini bersifat anonim. Data disimpan secara real-time ke database
          cloud untuk riset akademik internal.
        </p>
      </div>
    </div>
  );
}

// ─── HALAMAN HASIL (GRADE HURUF) ─────────────────────────────────────────────
function ResultOverlay({
  correct,
  total,
  onViewAnswerKey,
  onCloseResult,
  isSaving,
}) {
  const grade = getGrade(correct);

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="relative z-10 w-full max-w-2xl rounded-3xl border border-white/50 bg-white/60 p-8 text-center shadow-2xl backdrop-blur-xl sm:p-10">
        <div className="mx-auto mb-2 text-5xl">{grade.emoji}</div>
        <h2 className="text-lg font-bold text-slate-800">Kuis Selesai!</h2>
        <div className="my-6 flex flex-col items-center gap-3 sm:my-8">
          <div
            className={`flex h-28 w-28 items-center justify-center rounded-3xl border-2 shadow-lg sm:h-32 sm:w-32 ${grade.bg} border-current`}
          >
            <span className={`text-6xl font-black sm:text-7xl ${grade.color}`}>
              {grade.letter}
            </span>
          </div>
          <span
            className={`rounded-full px-4 py-1 text-sm font-bold ${grade.bg} ${grade.color}`}
          >
            Skor {grade.letter}
          </span>
        </div>
        <p className="mx-auto mb-4 max-w-lg text-sm leading-relaxed text-slate-600">
          {grade.description}
        </p>

        {isSaving && (
          <p className="mb-4 text-xs font-semibold text-blue-600 flex items-center justify-center gap-1.5 animate-pulse">
            <RefreshCw size={12} className="animate-spin" /> Menyimpan hasil ke
            database cloud...
          </p>
        )}

        <p className="mx-auto mb-6 max-w-lg text-xs leading-relaxed text-slate-400">
          Terima kasih atas partisipasi Anda. Respons Anda telah tersimpan dan
          sangat berharga bagi pemetaan pemahaman dasar akademik IT di kampus
          kita.
        </p>
        <div className="flex flex-col gap-2 sm:flex-row sm:justify-center sm:gap-3">
          <button
            onClick={onViewAnswerKey}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-slate-800 to-slate-700 py-3 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-xl sm:max-w-xs"
          >
            <BookOpen size={16} />
            Lihat Kunci Jawaban
          </button>
          <button
            onClick={onCloseResult}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/60 bg-white/40 py-3 text-sm font-medium text-slate-600 backdrop-blur-sm transition-all duration-300 hover:bg-white/70 sm:max-w-xs"
          >
            Tutup &amp; Selesai
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── DASBOR ADMIN DENGAN SUPABASE (CLOUD DATABASE) ────────────────────────────
function AdminDashboard({ onClose }) {
  const [records, setRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);
  const [confirmClear, setConfirmClear] = useState(false);
  const [isClearing, setIsClearing] = useState(false);

  // Fungsi Fetch seluruh data agregat dari Supabase
  const fetchRecords = useCallback(async () => {
    setIsLoading(true);
    setErrorMsg(null);

    if (!supabase) {
      setIsLoading(false);
      setErrorMsg(
        "Supabase belum terkonfigurasi. Pastikan VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY telah diisi di file .env Anda.",
      );
      return;
    }

    try {
      const { data, error } = await supabase
        .from("quiz_results")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        throw error;
      }

      if (data) {
        const formatted = data.map((d) => ({
          id: d.respondent_id || `R-${d.id}`,
          db_id: d.id,
          correct: Number(d.correct) || 0,
          total: Number(d.total) || QUESTIONS.length,
          grade: d.grade || getGrade(d.correct).letter,
          timestamp: d.created_at
            ? new Date(d.created_at).toLocaleString("id-ID", {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })
            : "-",
        }));
        setRecords(formatted);
      }
    } catch (err) {
      setErrorMsg(err.message || "Gagal memuat data dari database Supabase.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch data saat halaman dasbor dibuka
  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  // Fungsi Hapus Semua Data di tabel Supabase
  const handleClearAll = async () => {
    if (!supabase) return;
    setIsClearing(true);
    try {
      const { error } = await supabase
        .from("quiz_results")
        .delete()
        .neq("id", 0); // Menghapus seluruh baris

      if (error) {
        alert("Gagal menghapus data dari Supabase: " + error.message);
      } else {
        setRecords([]);
      }
    } catch (err) {
      alert("Terjadi kesalahan koneksi saat menghapus data.");
    } finally {
      setIsClearing(false);
      setConfirmClear(false);
    }
  };

  const totalRespondents = records.length;

  // Hitung jumlah per skor
  const dist = { A: 0, B: 0, C: 0, D: 0, E: 0 };
  records.forEach((r) => {
    const g = getGrade(r.correct);
    if (dist[g.letter] !== undefined) {
      dist[g.letter]++;
    }
  });

  const maxDist = Math.max(...Object.values(dist), 1);

  // Kalkulasi persentase akurat (anti-NaN jika responden 0)
  const calcPct = (count) => {
    if (!totalRespondents || totalRespondents === 0) return 0;
    return Math.round((count / totalRespondents) * 100);
  };

  const gradeColors = {
    A: "bg-emerald-500",
    B: "bg-blue-500",
    C: "bg-amber-500",
    D: "bg-orange-500",
    E: "bg-rose-500",
  };

  const gradeRanges = {
    A: "9-10 Benar",
    B: "7-8 Benar",
    C: "5-6 Benar",
    D: "3-4 Benar",
    E: "0-2 Benar",
  };

  const gradeStyle = (letter) =>
    getGrade(
      letter === "A"
        ? 10
        : letter === "B"
          ? 8
          : letter === "C"
            ? 6
            : letter === "D"
              ? 4
              : 1,
    );

  return (
    <div className="relative min-h-screen px-4 py-8">
      <GradientBg />
      <div className="mx-auto max-w-5xl">
        {/* Header Dasbor */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-slate-800 to-slate-600 shadow-lg">
              <Database size={20} className="text-white" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-slate-800">
                  Dasbor Admin
                </h1>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                  Supabase Cloud
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Data hasil kuis mahasiswa (Tabel:{" "}
                <code className="font-mono text-slate-700">quiz_results</code>)
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={fetchRecords}
              disabled={isLoading}
              title="Segarkan Data"
              className="flex items-center gap-1.5 rounded-xl border border-white/60 bg-white/50 px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-sm backdrop-blur-sm transition-all duration-300 hover:bg-white/80 hover:shadow-md disabled:opacity-50"
            >
              <RefreshCw
                size={13}
                className={isLoading ? "animate-spin" : ""}
              />
              Segarkan
            </button>
            {!confirmClear ? (
              <button
                onClick={() => setConfirmClear(true)}
                disabled={totalRespondents === 0 || isLoading}
                className="flex items-center gap-1.5 rounded-xl border border-red-200/60 bg-red-50/50 px-4 py-2 text-xs font-semibold text-red-600 shadow-sm backdrop-blur-sm transition-all duration-300 hover:bg-red-100/60 hover:shadow-md disabled:opacity-40"
              >
                <Trash2 size={14} /> Hapus Semua Data
              </button>
            ) : (
              <div className="flex items-center gap-2 rounded-xl border border-red-300/60 bg-red-50/60 px-4 py-2 backdrop-blur-sm">
                <span className="text-xs font-medium text-red-700">
                  Hapus dari cloud?
                </span>
                <button
                  onClick={handleClearAll}
                  disabled={isClearing}
                  className="rounded-lg bg-red-600 px-3 py-1 text-xs font-bold text-white transition-all hover:bg-red-700 disabled:opacity-50"
                >
                  {isClearing ? "Menghapus..." : "Ya, Hapus"}
                </button>
                <button
                  onClick={() => setConfirmClear(false)}
                  className="rounded-lg border border-slate-200 bg-white/60 px-3 py-1 text-xs font-medium text-slate-600 transition-all hover:bg-white"
                >
                  Batal
                </button>
              </div>
            )}
            <button
              onClick={onClose}
              className="flex items-center gap-1.5 rounded-xl border border-white/60 bg-white/50 px-4 py-2 text-xs font-semibold text-slate-600 shadow-sm backdrop-blur-sm transition-all duration-300 hover:bg-white/80 hover:shadow-md"
            >
              <LogOut size={14} /> Kembali ke Kuis
            </button>
          </div>
        </div>

        {/* Banner Peringatan jika Supabase belum terhubung */}
        {errorMsg && (
          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-amber-300/60 bg-amber-50/80 p-4 shadow-sm backdrop-blur-md text-amber-900">
            <CloudOff size={20} className="shrink-0 text-amber-600 mt-0.5" />
            <div className="text-xs leading-relaxed">
              <p className="font-bold">Koneksi Database Supabase</p>
              <p className="mt-0.5">{errorMsg}</p>
            </div>
          </div>
        )}

        {/* Ringkasan Statistik Utama */}
        <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
          <div className="relative z-10 rounded-2xl border border-white/50 bg-white/50 p-5 shadow-lg backdrop-blur-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl">
            <div className="mb-2 flex items-center gap-2">
              <Users size={14} className="text-blue-500" />
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Total Responden
              </p>
            </div>
            <p className="flex items-end gap-1">
              <span className="text-3xl font-extrabold text-slate-800">
                {isLoading ? "..." : totalRespondents}
              </span>
              <span className="mb-1 text-xs text-slate-400">orang</span>
            </p>
          </div>
          <div className="relative z-10 rounded-2xl border border-white/50 bg-white/50 p-5 shadow-lg backdrop-blur-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl">
            <div className="mb-2 flex items-center gap-2">
              <BarChart3 size={14} className="text-indigo-500" />
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Rata-Rata Benar
              </p>
            </div>
            <p className="flex items-end gap-1">
              <span className="text-3xl font-extrabold text-slate-800">
                {isLoading
                  ? "..."
                  : totalRespondents
                    ? (
                        records.reduce((a, r) => a + r.correct, 0) /
                        totalRespondents
                      ).toFixed(1)
                    : 0}
              </span>
              <span className="mb-1 text-xs text-slate-400">
                / {QUESTIONS.length}
              </span>
            </p>
          </div>
          <div className="relative z-10 col-span-2 rounded-2xl border border-white/50 bg-white/50 p-5 shadow-lg backdrop-blur-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl sm:col-span-1">
            <div className="mb-2 flex items-center gap-2">
              <Award size={14} className="text-amber-500" />
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Skor Tertinggi
              </p>
            </div>
            <p className="flex items-end gap-1">
              <span className="text-3xl font-extrabold text-slate-800">
                {isLoading
                  ? "..."
                  : totalRespondents
                    ? getGrade(Math.max(...records.map((r) => r.correct)))
                        .letter
                    : "-"}
              </span>
              <span className="mb-1 text-xs text-slate-400">
                (
                {totalRespondents
                  ? Math.max(...records.map((r) => r.correct))
                  : 0}
                /{QUESTIONS.length})
              </span>
            </p>
          </div>
        </div>

        {/* Ringkasan Statistik Total Per Rank (Format: Skor A: 5 orang (25%)) */}
        <div className="relative z-10 mb-6 rounded-2xl border border-white/50 bg-white/50 p-6 shadow-lg backdrop-blur-lg">
          <div className="mb-4 flex items-center justify-between border-b border-white/40 pb-3">
            <h3 className="flex items-center gap-2 text-sm font-bold text-slate-800">
              <PieChart size={16} className="text-blue-500" />
              Ringkasan Statistik Skor Responden
            </h3>
            <span className="text-xs text-slate-500">
              Total:{" "}
              <strong className="text-slate-800">{totalRespondents}</strong>{" "}
              responden
            </span>
          </div>

          {/* Kartu Ringkasan Format: Skor A: X orang (Y%) */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {["A", "B", "C", "D", "E"].map((letter) => {
              const count = dist[letter];
              const percentage = calcPct(count);
              const g = gradeStyle(letter);
              return (
                <div
                  key={letter}
                  className="flex flex-col gap-1 rounded-xl border border-white/60 bg-white/40 p-3.5 shadow-sm backdrop-blur-md transition-all duration-300 hover:bg-white/60 hover:shadow-md"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-500">
                      {gradeRanges[letter]}
                    </span>
                    <span
                      className={`flex h-6 w-6 items-center justify-center rounded-lg text-xs font-black shadow-sm ${g.bg} ${g.color}`}
                    >
                      {letter}
                    </span>
                  </div>
                  {/* Teks format presisi sesuai instruksi */}
                  <div className="mt-1">
                    <p className="text-sm font-bold text-slate-800">
                      Skor {letter}: {count} orang ({percentage}%)
                    </p>
                  </div>
                  {/* Mini Progress Bar */}
                  <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-200/60">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${gradeColors[letter]}`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Visual Grafik Batang Distribusi */}
          <div className="mt-6 border-t border-white/40 pt-5">
            <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
              Grafik Distribusi Frekuensi
            </h4>
            {isLoading ? (
              <div className="flex h-24 items-center justify-center text-xs text-slate-400">
                <RefreshCw size={14} className="animate-spin mr-2" /> Memuat
                data Supabase...
              </div>
            ) : totalRespondents === 0 ? (
              <div className="flex h-24 items-center justify-center text-xs text-slate-400">
                Belum ada data responden yang terekam di cloud.
              </div>
            ) : (
              <div className="flex items-end gap-3 sm:gap-6">
                {["A", "B", "C", "D", "E"].map((letter) => {
                  const count = dist[letter];
                  const barPct = (count / maxDist) * 100;
                  const g = gradeStyle(letter);
                  return (
                    <div
                      key={letter}
                      className="flex flex-1 flex-col items-center gap-1.5"
                    >
                      <span className="text-[11px] font-bold text-slate-600">
                        {count} ({calcPct(count)}%)
                      </span>
                      <div className="relative h-28 w-full overflow-hidden rounded-xl bg-white/40">
                        <div
                          className={`absolute bottom-0 left-0 w-full rounded-xl transition-all duration-700 ${gradeColors[letter]}`}
                          style={{
                            height:
                              count > 0 ? `${Math.max(barPct, 10)}%` : "0%",
                            opacity: 0.8,
                          }}
                        />
                      </div>
                      <span className={`text-sm font-black ${g.color}`}>
                        {letter}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Tabel Riwayat Semua Responden dari Supabase */}
        <div className="relative z-10 overflow-hidden rounded-2xl border border-white/50 bg-white/50 shadow-lg backdrop-blur-lg">
          <div className="flex items-center gap-2 border-b border-white/40 px-6 py-4">
            <Users size={16} className="text-slate-400" />
            <h2 className="text-sm font-semibold text-slate-700">
              Riwayat Lengkap Responden (Sinkronisasi Cloud)
            </h2>
            <span className="ml-auto rounded-full bg-slate-200/60 px-2.5 py-0.5 text-[10px] font-bold text-slate-500">
              {totalRespondents} data
            </span>
          </div>
          {isLoading ? (
            <div className="py-16 text-center text-sm text-slate-400 flex items-center justify-center gap-2">
              <RefreshCw size={16} className="animate-spin text-blue-500" />
              Menghubungkan ke database Supabase...
            </div>
          ) : totalRespondents === 0 ? (
            <div className="py-16 text-center text-sm text-slate-400">
              Belum ada responden yang mengumpulkan jawaban di database cloud.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-white/30 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    <th className="px-6 py-3">#</th>
                    <th className="px-6 py-3">ID Responden</th>
                    <th className="px-6 py-3">Waktu Input (Cloud)</th>
                    <th className="px-6 py-3 text-center">Jawaban Benar</th>
                    <th className="px-6 py-3 text-center">Skor Huruf</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((r, i) => {
                    const g = getGrade(r.correct);
                    return (
                      <tr
                        key={r.db_id || r.id + "-" + i}
                        className="border-t border-white/30 transition-colors hover:bg-white/30"
                      >
                        <td className="px-6 py-4 font-mono text-xs text-slate-400">
                          {String(i + 1).padStart(2, "0")}
                        </td>
                        <td className="px-6 py-4 font-mono text-xs font-semibold text-slate-700">
                          {r.id}
                        </td>
                        <td className="px-6 py-4 text-xs text-slate-500">
                          {r.timestamp || "-"}
                        </td>
                        <td className="px-6 py-4 text-center font-semibold text-slate-700">
                          {r.correct}/{r.total}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold backdrop-blur-sm ${g.bg} ${g.color}`}
                          >
                            {g.emoji} {g.letter}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── HALAMAN KUIS ─────────────────────────────────────────────────────────────
function QuizPage({
  shuffledQuestions,
  shuffledOptionsMap,
  onSubmit,
  onAdminClick,
}) {
  const [answers, setAnswers] = useState({});

  const answered = Object.keys(answers).length;
  const total = shuffledQuestions.length;
  const progress = Math.round((answered / total) * 100);

  const handleSelect = (id, opt) => {
    setAnswers((prev) => ({ ...prev, [id]: opt }));
  };

  const handleSubmit = () => {
    const correct = QUESTIONS.filter((q) => answers[q.id] === q.answer).length;
    onSubmit(correct, answers);
  };

  return (
    <div className="relative min-h-screen">
      <GradientBg />
      <header className="sticky top-0 z-30 border-b border-white/40 bg-white/40 backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <div>
            <h1 className="text-sm font-bold text-slate-800">
              Kuis Riset Mahasiswa IT
            </h1>
            <p className="text-xs text-slate-500">
              {answered}/{total} dijawab
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden flex-col items-end gap-1 sm:flex">
              <span className="text-xs font-semibold text-slate-600">
                {progress}%
              </span>
              <div className="h-1.5 w-24 overflow-hidden rounded-full bg-white/50">
                <div
                  className="h-full rounded-full bg-blue-500 transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
            {/* Pintu Masuk Admin Tersembunyi di Header Kuis */}
            <button
              onClick={onAdminClick}
              title="Admin"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-300/60 transition-all duration-300 hover:bg-white/50 hover:text-slate-500"
            >
              <Lock size={14} />
            </button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-8">
        <div className="mb-6">
          <h2 className="text-base font-bold text-slate-800">
            Jawab Semua Pertanyaan
          </h2>
          <p className="mt-0.5 text-xs text-slate-500">
            Pilih satu jawaban yang paling tepat untuk setiap soal di bawah.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {shuffledQuestions.map((q, i) => (
            <QuestionCard
              key={q.id}
              q={q}
              displayIndex={i + 1}
              shuffledOptions={shuffledOptionsMap[q.id]}
              selected={answers[q.id]}
              onSelect={handleSelect}
            />
          ))}
        </div>
        <div className="mt-8 flex flex-col items-center gap-3">
          {answered < total && (
            <p className="text-xs text-slate-400">
              Masih ada{" "}
              <span className="font-semibold text-slate-600">
                {total - answered} soal
              </span>{" "}
              yang belum dijawab.
            </p>
          )}
          <button
            onClick={handleSubmit}
            disabled={answered < total}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-slate-800 to-slate-700 px-8 py-3.5 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-40"
          >
            <CheckCircle2 size={16} />
            Selesai &amp; Kumpulkan
          </button>
          {answered === total && (
            <p className="text-xs font-medium text-emerald-600">
              ✓ Semua soal telah dijawab — siap dikumpulkan!
            </p>
          )}
        </div>
      </main>
    </div>
  );
}

// ─── ROOT APP ──────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("welcome");
  const [result, setResult] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [quizSeed, setQuizSeed] = useState(0);

  // Algoritma Fisher-Yates untuk acak urutan soal DAN opsi jawaban setiap kali kuis dimulai/direset
  const { shuffledQuestions, shuffledOptionsMap } = useMemo(() => {
    const sq = shuffleArray(QUESTIONS);
    const som = {};
    sq.forEach((q) => {
      som[q.id] = shuffleArray(q.options);
    });
    return { shuffledQuestions: sq, shuffledOptionsMap: som };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quizSeed]);

  const handleStart = () => {
    setResult(null);
    setQuizSeed((s) => s + 1); // Mengacak ulang pertanyaan & pilihan jawaban
    setPage("quiz");
  };

  // Simpan data (INSERT) ke tabel Supabase quiz_results
  const handleSubmit = useCallback(async (correct, answers) => {
    const total = QUESTIONS.length;
    const now = new Date();
    const respondentId = "R-" + now.getTime().toString(36).toUpperCase();
    const grade = getGrade(correct).letter;

    // Tampilkan hasil langsung ke layar mahasiswa
    setResult({ correct, total, answers });

    // Kirim data ke Cloud Database Supabase
    if (supabase) {
      setIsSaving(true);
      try {
        const { error } = await supabase.from("quiz_results").insert([
          {
            respondent_id: respondentId,
            correct: correct,
            total: total,
            grade: grade,
          },
        ]);

        if (error) {
          console.error("Gagal menyimpan hasil ke Supabase:", error.message);
        } else {
          console.log("Hasil kuis berhasil disimpan ke Supabase.");
        }
      } catch (err) {
        console.error("Koneksi Supabase error:", err);
      } finally {
        setIsSaving(false);
      }
    } else {
      console.warn(
        "Supabase belum diinisialisasi. Periksa konfigurasi file .env Anda.",
      );
    }
  }, []);

  const handleCloseResult = () => {
    setResult(null);
    setPage("welcome");
  };

  const handleViewAnswerKey = () => {
    setPage("answerKey");
  };

  const openAdminLogin = useCallback(() => setShowAdminLogin(true), []);
  const closeAdminLogin = useCallback(() => setShowAdminLogin(false), []);

  // ── Halaman Kunci Jawaban
  if (page === "answerKey" && result) {
    return (
      <AnswerKeyPage
        questions={shuffledQuestions}
        answers={result.answers}
        correct={result.correct}
        total={result.total}
        onClose={handleCloseResult}
      />
    );
  }

  // ── Dasbor Admin (Fetch Cloud Supabase)
  if (page === "admin") {
    return <AdminDashboard onClose={() => setPage("welcome")} />;
  }

  // ── Halaman Welcome (Anonim)
  if (page === "welcome") {
    return (
      <>
        <WelcomePage onStart={handleStart} onAdminClick={openAdminLogin} />
        {showAdminLogin && (
          <AdminLoginModal
            onClose={closeAdminLogin}
            onSuccess={() => {
              closeAdminLogin();
              setPage("admin");
            }}
          />
        )}
      </>
    );
  }

  // ── Halaman Kuis
  return (
    <>
      <QuizPage
        shuffledQuestions={shuffledQuestions}
        shuffledOptionsMap={shuffledOptionsMap}
        onSubmit={handleSubmit}
        onAdminClick={openAdminLogin}
      />

      {result && (
        <ResultOverlay
          correct={result.correct}
          total={result.total}
          isSaving={isSaving}
          onViewAnswerKey={handleViewAnswerKey}
          onCloseResult={handleCloseResult}
        />
      )}

      {showAdminLogin && (
        <AdminLoginModal
          onClose={closeAdminLogin}
          onSuccess={() => {
            closeAdminLogin();
            setPage("admin");
          }}
        />
      )}
    </>
  );
}
