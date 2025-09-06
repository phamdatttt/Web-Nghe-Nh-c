import { useSignIn } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";

const SignInOAuthButtons = () => {
    const { signIn, isLoaded } = useSignIn();

    if (!isLoaded) {
        return null;
    }

    const signInWithGoogle = async () => {
        try {
            // Mở Google OAuth với tùy chọn chọn tài khoản
            const result = await signIn.authenticateWithRedirect({
                strategy: "oauth_google",
                redirectUrl: `${window.location.origin}/sso-callback`,
                redirectUrlComplete: `${window.location.origin}/auth-callback`,
                // Buộc Google hiển thị màn hình chọn tài khoản
                additionalData: {
                    prompt: "select_account"
                }
            });
        } catch (err) {
            console.error("Error signing in with Google:", err);
        }
    };

    return (
        <Button 
            onClick={signInWithGoogle} 
            variant={"secondary"} 
            className='w-full text-white border-zinc-200 h-11 flex items-center gap-2'
        >
            <img src='./img/google.png' alt='Google' className='size-5' />
            Sign in with Google
        </Button>
    );
};

export default SignInOAuthButtons;
