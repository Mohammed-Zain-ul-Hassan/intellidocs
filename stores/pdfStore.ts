import { create } from 'zustand'

// Zustand store to manage parsed PDF data
type PdfStore = {
  parsedText: string | null
  setParsedText: (content: string) => void
  clearParsedText: () => void
}

export const usePdfStore = create<PdfStore>((set) => ({
  parsedText: null, // Default state is empty
  setParsedText: (content) => set(() => ({ parsedText: content })),
  clearParsedText: () => set(() => ({ parsedText: null })),
}))
