export interface ABASTECIMENTO {
  DOCUMENTO?: string
  'DATA EMISSAO'?: string
  PESSOA?: string
  CPNJCPF?: string
  CODIGO?: string
  ITEM?: string
  'VALOR LIQUIDO'?: string
  CUPOMFISCAL?: string
}

export interface COOPERADO {
  ID?: string
  COOPERADO?: string
  CONTATOCOOPERADO?: string
  CNPJCPFCOOPERADO?: string
  EMAILCOOPERADO?: string
  OPERACAO?: string
}

export interface responseAPI {
  DOCUMENTO?: string
  'DATA EMISSAO'?: string
  NOME?: string
  CPNJCPF?: string
  PARCELA?: string
  VALOR?: string
  VALORBAIXADO?: string
  VALORPENDENTE?: string
  PESSOA?: string
  CODIGO?: string
}
