from services.embedding_service import create_embedding

text = "Tôi muốn đọc truyện của Nam Cao"

embedding = create_embedding(text)

print("Dimension:", len(embedding))
print("\n10 giá trị đầu:")

for i in embedding[:10]:
    print(i)