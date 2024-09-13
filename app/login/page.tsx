import LoginPage from "@/components/Login"

export default function Page() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-blue-500 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
        <LoginPage />
      </div>
    </div>
  )
}