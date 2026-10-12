from transformers import AutoTokenizer, AutoModelForCausalLM
import torch

MODEL_NAME = "Qwen/Qwen2.5-Coder-1.5B"


def load_ai_model():

    print("Loading AI model...")

    tokenizer = AutoTokenizer.from_pretrained(
        MODEL_NAME
    )

    model = AutoModelForCausalLM.from_pretrained(
        MODEL_NAME,
        device_map="cpu",
        torch_dtype=torch.float32
    )

    model.eval()

    print("AI model loaded successfully!")

    return tokenizer, model