import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface AIIcebreakerResult {
  icebreaker: string;
  topics: string[];
  sharedSkills: string[];
}

export const useAIIcebreaker = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<AIIcebreakerResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const generateIcebreaker = useCallback(async (
    userSkills: string[],
    partnerSkills: string[],
    partnerName: string,
    language: "nl" | "en" = "nl"
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      const { data: result, error: invokeError } = await supabase.functions.invoke(
        "generate-icebreaker",
        {
          body: {
            userSkills,
            partnerSkills,
            partnerName,
            language,
          },
        }
      );

      if (invokeError) {
        console.error("Icebreaker generation error:", invokeError);
        
        if (invokeError.message?.includes("429")) {
          toast.error(language === "nl" 
            ? "Te veel verzoeken. Probeer later opnieuw." 
            : "Too many requests. Please try again later."
          );
          setError("rate_limit");
        } else if (invokeError.message?.includes("402")) {
          toast.error(language === "nl" 
            ? "AI-credits op. Voeg credits toe." 
            : "AI credits depleted. Please add credits."
          );
          setError("credits_depleted");
        } else {
          setError("unknown");
        }
        return null;
      }

      setData(result as AIIcebreakerResult);
      return result as AIIcebreakerResult;
    } catch (err) {
      console.error("Failed to generate icebreaker:", err);
      setError("network");
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    generateIcebreaker,
    isLoading,
    data,
    error,
  };
};
