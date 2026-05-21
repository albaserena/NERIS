import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode
} from 'react';

import { auth } from '../../firebase';

interface Dog {
  id: number;
  name: string;
  breed: string;
  age: string;
  birthDate: string;
  gender: string;
  weight: string;
  color: string;
  chip: string;
  pedigree: string;
  status: string;
  image: string;
  appointments?: Array<{  label: string;  date: string; type?: string;}>;
  medicalHistory?: Array<{ label: string; date: string }>;
  litters?: Array<{ label: string; date: string; puppies: number }>;
  awards?: Array<{ label: string; event: string }>;
  documents?: Array<{ name: string; type: string }>;
}

interface DogsContextType {
  dogs: Dog[];
  addDog: (dog: Dog) => void;
  updateDog: (id: number, data: Partial<Dog>) => void;
  deleteDog: (id: number) => void;
  getDogById: (id: number) => Dog | undefined;
}

const DogsContext = createContext<DogsContextType | undefined>(undefined);

export function DogsProvider({
  children
}: {
  children: ReactNode;
}) {

  const getStorageKey = () => {

    const user = auth.currentUser;

    if (!user) return 'neris_dogs_guest';

    return `neris_dogs_${user.uid}`;
  };

  const [dogs, setDogs] = useState<Dog[]>([]);

  // CARGAR PERROS DEL USUARIO
  useEffect(() => {

    const loadDogs = () => {

      const storageKey = getStorageKey();

      const saved = localStorage.getItem(storageKey);

      setDogs(
        saved ? JSON.parse(saved) : []
      );
    };

    loadDogs();

    const unsubscribe = auth.onAuthStateChanged(() => {

      loadDogs();

    });

    return () => unsubscribe();

  }, []);

  // GUARDAR PERROS DEL USUARIO
  useEffect(() => {

    const storageKey = getStorageKey();

    localStorage.setItem(
      storageKey,
      JSON.stringify(dogs)
    );

  }, [dogs]);

  const addDog = (dog: Dog) => {

    setDogs((prev) => [...prev, dog]);

  };

  const updateDog = (
    id: number,
    data: Partial<Dog>
  ) => {

    setDogs((prev) =>
      prev.map((dog) =>
        dog.id === id
          ? { ...dog, ...data }
          : dog
      )
    );

  };

  const deleteDog = (id: number) => {

    setDogs((prev) =>
      prev.filter((dog) => dog.id !== id)
    );

  };

  const getDogById = (id: number) => {

    return dogs.find(
      (dog) => dog.id === id
    );

  };

  return (

    <DogsContext.Provider
      value={{
        dogs,
        addDog,
        updateDog,
        deleteDog,
        getDogById
      }}
    >

      {children}

    </DogsContext.Provider>

  );
}

export function useDogs() {

  const context = useContext(DogsContext);

  if (!context) {

    throw new Error(
      'useDogs must be used within DogsProvider'
    );

  }

  return context;
}