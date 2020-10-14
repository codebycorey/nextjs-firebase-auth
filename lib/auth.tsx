import { createContext, Context, useContext, useState, useEffect } from 'react';
import firebase from './firebase';
import { createUser } from './db';

interface Auth {
  uid: string;
  email: string | null;
  name: string | null;
  photoUrl: string | null;
  token: string | null;
}

interface AuthContext {
  auth: Auth | null;
  loading: boolean;
  signInWithTwitter: () => Promise<void>;
  signOut: () => Promise<void>;
}

const authContext: Context<AuthContext> = createContext<AuthContext>({
  auth: null,
  loading: true,
  signInWithTwitter: async () => {},
  signOut: async () => {}
});

const formatAuthState = (user: firebase.User): Auth => ({
  uid: user.uid,
  email: user.email,
  name: user.displayName,
  photoUrl: user.photoURL,
  token: null
});

function useProvideAuth() {
  const [auth, setAuth] = useState<Auth | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  /**
   * Callback function used for firebase.auth.onAuthStateChanged().
   * Takes the user object returned and formats it for my state.
   * We fetch the idToken and append it to my auth state and store it.
   */
  const handleAuthChange = async (authState: firebase.User | null) => {
    if (!authState) {
      return;
    }

    // Formats response into my required state.
    const formattedAuth = formatAuthState(authState);
    // Fetch firebase auth ID Token.
    formattedAuth.token = await authState.getIdToken();
    // Stores auth into state.
    setAuth(formattedAuth);
    // Sets loading state to false.
    setLoading(false);
  };

  /**
   * Callback function used for response from firebase OAuth.
   * Store user object returned in firestore.
   * @param firebase User Credential
   */
  const signedIn = async (response: firebase.auth.UserCredential) => {
    if (!response.user) {
      throw new Error('No User');
    }

    // Format user into my required state.
    const authedUser = formatAuthState(response.user);
    // firestore database function
    createUser(authedUser.uid as string, authedUser);
  };

  /**
   * Callback for when firebase signOut.
   * Sets auth state to null and loading to true.
   */
  const clear = () => {
    setAuth(null);
    setLoading(true);
  };

  /**
   * Triggers firebase Oauth for twitter and calls signIn when successful.
   * sets loading to true.
   */
  const signInWithTwitter = () => {
    setLoading(true);
    return firebase.auth().signInWithPopup(new firebase.auth.TwitterAuthProvider()).then(signedIn);
  };

  /**
   * Calls firebase signOut and with clear callback to reset state.
   */
  const signOut = () => {
    return firebase.auth().signOut().then(clear);
  };

  /**
   * Watches for state change for firebase auth and calls the handleAuthChange callback
   * on every change.
   */
  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged(handleAuthChange);
    return () => unsubscribe();
  }, []);

  // returns state values and callbacks for signIn and signOut.
  return {
    auth,
    loading,
    signInWithTwitter,
    signOut
  };
}

export function AuthProvider({ children }: any) {
  const auth = useProvideAuth();
  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}

export const useAuth = () => useContext(authContext);
