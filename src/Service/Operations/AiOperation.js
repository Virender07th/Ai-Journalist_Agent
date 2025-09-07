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

      try {
        const response = await apiConnector("POST", endpoint, formData);

        if (!response.data || !response.data.success) {
          throw new Error(response.data?.message || "Unknown error occurred");
        }

        toast.dismiss(toastBar);
        toast.success(successMessage);

        console.log(response.data);
        
        return response.data;
      } catch (error) {
        toast.dismiss(toastBar);
        console.error(`${endpoint} ERROR`, error);
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
