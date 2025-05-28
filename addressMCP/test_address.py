from app import validate_address

print("Adres Doğrulama Sistemi")
print("-" * 50)
print("Not: Adresi şu formatta girin:")
print("Sokak Adresi, Şehir, Eyalet/İl, Posta Kodu, Ülke")
print("Örnek: Barbaros Bulvarı No:145, Beşiktaş, İstanbul, 34349, Turkey")
print("-" * 50)

# Test adresi
test_address = input("Lütfen doğrulamak istediğiniz adresi girin: ")

# Adresi doğrula
result = validate_address(test_address)

# Sonuçları göster
print("\nDoğrulama Sonuçları:")
print("-" * 50)

# Ana sonucu göster
print(f"Durum: {result['validation_status']}")
print(f"Mesaj: {result['message']}")

# Koordinatları göster (eğer varsa)
if result['coordinates']:
    print("\nKoordinatlar:")
    print(f"  Enlem: {result['coordinates']['latitude']}")
    print(f"  Boylam: {result['coordinates']['longitude']}")

# Girilen adresi göster
print("\nGirilen Adres Bilgileri:")
if result['input_address']:
    print(f"  Sokak: {result['input_address']['street_address']}")
    print(f"  Şehir: {result['input_address']['city']}")
    print(f"  Eyalet/İl: {result['input_address']['state']}")
    print(f"  Posta Kodu: {result['input_address']['postal_code']}")
    print(f"  Ülke: {result['input_address']['country']}")

print("-" * 50)

# Örnek test adresleri
test_addresses = [
    "1600 Pennsylvania Avenue NW, Washington, DC, 20500, United States",
    "221B Baker Street, London, Greater London, NW1 6XE, United Kingdom",
    "Barbaros Bulvarı No:145, Beşiktaş, İstanbul, 34349, Turkey"
]

print("\nÖrnek Adreslerle Test:")
for address in test_addresses:
    print("\n" + "=" * 70)
    print(f"Test Adresi: {address}")
    result = validate_address(address)
    
    print("\nSonuç:")
    print(f"Durum: {result['validation_status']}")
    print(f"Mesaj: {result['message']}")
    
    if result['coordinates']:
        print("\nKoordinatlar:")
        print(f"  Enlem: {result['coordinates']['latitude']}")
        print(f"  Boylam: {result['coordinates']['longitude']}")
    
    print("\nGirilen Adres Bilgileri:")
    if result['input_address']:
        print(f"  Sokak: {result['input_address']['street_address']}")
        print(f"  Şehir: {result['input_address']['city']}")
        print(f"  Eyalet/İl: {result['input_address']['state']}")
        print(f"  Posta Kodu: {result['input_address']['postal_code']}")
        print(f"  Ülke: {result['input_address']['country']}")
    print("=" * 70) 