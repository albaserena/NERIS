import { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';

export type DocumentCategory = 'cartilla_sanitaria' | 'certificado_oficial' | 'pedigree' | 'contrato';

export type DocumentItem = {
  id: string;
  name: string;
  categoryId: DocumentCategory;
  categoryLabel: string;
  type: string;
  createdAt: string;
  path: string;
  url: string;
  dogId?: number;
  dogName?: string;
};

interface DocsContextType {
  documents: DocumentItem[];
  setDocuments: (docs: DocumentItem[]) => void;
  addDocument: (doc: DocumentItem) => void;
  removeDocument: (id: string) => void;
}

const DocsContext = createContext<DocsContextType | undefined>(undefined);

const getStorageKey = (uid: string) => `neris_documents_${uid}`;

export function DocsProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [documents, setDocumentsState] = useState<DocumentItem[]>([]);

  // Cargar documentos al iniciar o cuando cambia el usuario
  useEffect(() => {
    if (!user) {
      setDocumentsState([]);
      return;
    }

    const saved = localStorage.getItem(getStorageKey(user.uid));
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setDocumentsState(Array.isArray(parsed) ? parsed : []);
      } catch (error) {
        console.error('Error parsing documents from localStorage:', error);
        setDocumentsState([]);
      }
    }
  }, [user]);

  // Guardar documentos en localStorage cada vez que cambian
  useEffect(() => {
    if (!user) return;

    try {
      localStorage.setItem(getStorageKey(user.uid), JSON.stringify(documents));
    } catch (error) {
      console.error('Error saving documents to localStorage:', error);
    }
  }, [documents, user]);

  const setDocuments = (docs: DocumentItem[]) => {
    setDocumentsState(docs);
  };

  const addDocument = (doc: DocumentItem) => {
    setDocumentsState((prev) => [doc, ...prev]);
  };

  const removeDocument = (id: string) => {
    setDocumentsState((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <DocsContext.Provider value={{ documents, setDocuments, addDocument, removeDocument }}>
      {children}
    </DocsContext.Provider>
  );
}

export function useDocs() {
  const context = useContext(DocsContext);
  if (!context) {
    throw new Error('useDocs must be used within DocsProvider');
  }
  return context;
}
