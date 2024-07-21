const userFieldMap = {
    "Nome completo": "name",
    "CPF": "cpf",
    "Data de nascimento": "birth_date",
    "Address": "personal_address",
    "Address2": "personal_address2",        
    "City/Town": "city",
    "State/Region/Province": "state",
    "Zip/Post Code": "postcode",
    "Country": "country",
    "Telefone": "phone"
};

const artworkFieldMap = {
    "Tipo de objeto": "object_type",
    "Título do objeto": "object_title",
    "Nome do fabricante/artista": "manufacturer_artist_name",
    "Ano de criação do objeto": "creation_year",
    "Dimensões do objeto": "object_dimensions",
    "Descrição do objeto": "object_description",
    "Condições da aquisição": "acquisition_conditions",
    "Preço de aquisição": "acquisition_price",
    "Preço pretendido": "desired_price",
    "Carregar documentação/certificados do objeto": "document_upload",
    "Carregar comprovante de compra do objeto": "purchase_proof_upload",
    "Carregar uma imagem do objeto": "image_upload",
    "Carregar comprovante de pagamento de taxa": "fee_payment_proof_upload"
};


export { userFieldMap, artworkFieldMap };