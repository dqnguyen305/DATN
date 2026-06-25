import faiss

index = faiss.read_index(
    "vectors/faiss.index"
)

print(
    f"Total vectors: {index.ntotal}"
)