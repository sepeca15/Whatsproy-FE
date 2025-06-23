export interface Cliente {
    id: number
    nombre: string
    telefono: string
    empresa_id: number
    totalGenerated: number
    createdAt: string
    updatedAt: string
    notificar_menu: boolean;
    pedido: any[]
}