import { SignIn } from "@clerk/clerk-react";

const SignInPage = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-zinc-800 to-zinc-900 p-4">
            <SignIn 
                routing="path" 
                path="/sign-in" 
                signUpUrl="/sign-up"
                redirectUrl="/auth-callback"
                appearance={{
                    elements: {
                        rootBox: "mx-auto",
                        card: "bg-zinc-900 border border-zinc-800",
                        headerTitle: "text-white",
                        headerSubtitle: "text-zinc-400",
                        socialButtonsBlockButton: "bg-zinc-800 hover:bg-zinc-700 text-white",
                        formButtonPrimary: "bg-green-500 hover:bg-green-600 text-white",
                        footerActionLink: "text-green-500 hover:text-green-400"
                    }
                }}
                afterSignInUrl="/auth-callback"
                signInUrl="/sign-in"
            />
        </div>
    );
};

export default SignInPage;
