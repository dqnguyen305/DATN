from services.rag_service import ask

history = []

answer = ask(
    history,
    "Tôi muốn đọc truyện của Nam Cao"
)

print("\nANSWER:")
print(answer)