import { AiEndpoints } from "../apis";
import { apiConnector } from "../apiConnector";
import { setLoading } from "../../Slice/AiSlice";
import toast from "react-hot-toast";

const {
  SUMMARIZER_API,
  TRANSLATE_API,
  FETCH_NEWS_ARTICLES_API,
  BIAS_DETECTION_API,
  FACT_CHECK_NEWS_API,
} = AiEndpoints;

function createAIAction(endpoint, successMessage) {
  return (formData) => {
    return async (dispatch) => {
      const toastBar = toast.loading("Loading...");
      dispatch(setLoading(true));

      console.log(`🚀 Starting ${endpoint} request with data:`, formData);

      try {
        const response = await apiConnector("POST", endpoint, formData, {
          headers: {
            "Content-Type": "application/json",
          },
        });

        console.log(`📥 Raw response for ${endpoint}:`, response);
        console.log(`📊 Response status:`, response?.status);
        console.log(`🔍 Response data:`, response?.data);
        console.log(`✅ Response data type:`, typeof response?.data);

        // Check if response exists
        if (!response) {
          console.error(`❌ No response received from ${endpoint}`);
          throw new Error("No response received from server");
        }

        if (!response.data) {
          console.error(`❌ No response.data for ${endpoint}`, response);
          throw new Error("No data in response from server");
        }

        // For bias detection, log the specific structure
        if (endpoint === BIAS_DETECTION_API) {
          console.log(`🎯 Bias Detection - Full Response Structure:`, JSON.stringify(response.data, null, 2));
          console.log(`🎯 Bias Detection - Has success field:`, 'success' in response.data);
          console.log(`🎯 Bias Detection - Success value:`, response.data.success);
        }

        // Check for success field - modified logic
        if (response.data.hasOwnProperty('success') && !response.data.success) {
          console.error(`❌ API returned success: false for ${endpoint}`, response.data);
          throw new Error(response.data?.message || "API returned unsuccessful response");
        }

        // If no success field exists, assume it's successful (for APIs that don't return success field)
        if (!response.data.hasOwnProperty('success')) {
          console.log(`⚠️ No 'success' field found in response for ${endpoint}, assuming successful`);
          // Create a wrapper with success: true for consistency
          const wrappedResponse = {
            success: true,
            data: response.data
          };
          
          toast.dismiss(toastBar);
          toast.success(successMessage);
          
          console.log(`✅ ${endpoint} completed successfully (no success field):`, wrappedResponse);
          return wrappedResponse;
        }

        toast.dismiss(toastBar);
        toast.success(successMessage);

        console.log(`✅ ${endpoint} completed successfully:`, response.data);
        return response.data;

      } catch (error) {
        toast.dismiss(toastBar);
        
        console.error(`💥 Error in ${endpoint}:`, error);
        console.error(`💥 Error type:`, error.constructor.name);
        console.error(`💥 Error message:`, error.message);
        console.error(`💥 Error response:`, error.response);
        console.error(`💥 Error response data:`, error.response?.data);
        console.error(`💥 Error response status:`, error.response?.status);
        
        toast.error(
          error.response?.data?.message ||
            error.message ||
            "Something went wrong"
        );
        throw error;
      } finally {
        dispatch(setLoading(false));
      }
    };
  };
}

export const summarizer = createAIAction(
  SUMMARIZER_API,
  "Paragraph summarization successful"
);

export const translate = createAIAction(
  TRANSLATE_API,
  "Translation successful"
);

export const fetchNews = createAIAction(
  FETCH_NEWS_ARTICLES_API,
  "Fetched latest news articles"
);

export const factCheckNews = createAIAction(
  FACT_CHECK_NEWS_API,
  "Fact check completed"
);

export const biasDetection = createAIAction(
  BIAS_DETECTION_API,
  "Bias detection completed"
);