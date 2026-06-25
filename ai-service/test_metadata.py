import pickle

with open(
    "vectors/metadata.pkl",
    "rb"
) as f:
    metadata = pickle.load(f)

print("Total books:", len(metadata))

for book in metadata[:5]:
    print(book)