export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      activity_logs: {
        Row: {
          action: string
          created_at: string | null
          entity_id: string | null
          entity_type: string
          id: string
          ip_address: unknown | null
          new_values: Json | null
          old_values: Json | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          entity_id?: string | null
          entity_type: string
          id?: string
          ip_address?: unknown | null
          new_values?: Json | null
          old_values?: Json | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          entity_id?: string | null
          entity_type?: string
          id?: string
          ip_address?: unknown | null
          new_values?: Json | null
          old_values?: Json | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "activity_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      attachments: {
        Row: {
          created_at: string | null
          entity_id: string
          entity_type: string
          file_size: number
          filename: string
          id: string
          mime_type: string
          original_filename: string
          storage_path: string
          uploaded_by: string | null
        }
        Insert: {
          created_at?: string | null
          entity_id: string
          entity_type: string
          file_size: number
          filename: string
          id?: string
          mime_type: string
          original_filename: string
          storage_path: string
          uploaded_by?: string | null
        }
        Update: {
          created_at?: string | null
          entity_id?: string
          entity_type?: string
          file_size?: number
          filename?: string
          id?: string
          mime_type?: string
          original_filename?: string
          storage_path?: string
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "attachments_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      contas_pagar: {
        Row: {
          categoria: Database["public"]["Enums"]["categoria_despesa"]
          created_at: string | null
          data_emissao: string
          data_pagamento: string | null
          data_vencimento: string
          descricao: string
          forma_pagamento: Database["public"]["Enums"]["forma_pagamento"] | null
          fornecedor: string
          id: string
          numero: string
          observacoes: string | null
          prioridade: Database["public"]["Enums"]["prioridade_pagamento"]
          proximo_vencimento: string | null
          recorrente: boolean | null
          status: Database["public"]["Enums"]["status_conta"]
          updated_at: string | null
          valor: number
        }
        Insert: {
          categoria: Database["public"]["Enums"]["categoria_despesa"]
          created_at?: string | null
          data_emissao?: string
          data_pagamento?: string | null
          data_vencimento: string
          descricao: string
          forma_pagamento?:
            | Database["public"]["Enums"]["forma_pagamento"]
            | null
          fornecedor: string
          id?: string
          numero: string
          observacoes?: string | null
          prioridade?: Database["public"]["Enums"]["prioridade_pagamento"]
          proximo_vencimento?: string | null
          recorrente?: boolean | null
          status?: Database["public"]["Enums"]["status_conta"]
          updated_at?: string | null
          valor: number
        }
        Update: {
          categoria?: Database["public"]["Enums"]["categoria_despesa"]
          created_at?: string | null
          data_emissao?: string
          data_pagamento?: string | null
          data_vencimento?: string
          descricao?: string
          forma_pagamento?:
            | Database["public"]["Enums"]["forma_pagamento"]
            | null
          fornecedor?: string
          id?: string
          numero?: string
          observacoes?: string | null
          prioridade?: Database["public"]["Enums"]["prioridade_pagamento"]
          proximo_vencimento?: string | null
          recorrente?: boolean | null
          status?: Database["public"]["Enums"]["status_conta"]
          updated_at?: string | null
          valor?: number
        }
        Relationships: []
      }
      contas_receber: {
        Row: {
          categoria: Database["public"]["Enums"]["categoria_receita"]
          cliente_id: string
          created_at: string | null
          data_emissao: string
          data_pagamento: string | null
          data_vencimento: string
          descricao: string
          forma_pagamento: Database["public"]["Enums"]["forma_pagamento"] | null
          id: string
          numero: string
          observacoes: string | null
          os_id: string | null
          status: Database["public"]["Enums"]["status_conta"]
          tentativas_cobranca: number | null
          ultima_cobranca: string | null
          updated_at: string | null
          valor: number
          valor_pago: number | null
        }
        Insert: {
          categoria: Database["public"]["Enums"]["categoria_receita"]
          cliente_id: string
          created_at?: string | null
          data_emissao?: string
          data_pagamento?: string | null
          data_vencimento: string
          descricao: string
          forma_pagamento?:
            | Database["public"]["Enums"]["forma_pagamento"]
            | null
          id?: string
          numero: string
          observacoes?: string | null
          os_id?: string | null
          status?: Database["public"]["Enums"]["status_conta"]
          tentativas_cobranca?: number | null
          ultima_cobranca?: string | null
          updated_at?: string | null
          valor: number
          valor_pago?: number | null
        }
        Update: {
          categoria?: Database["public"]["Enums"]["categoria_receita"]
          cliente_id?: string
          created_at?: string | null
          data_emissao?: string
          data_pagamento?: string | null
          data_vencimento?: string
          descricao?: string
          forma_pagamento?:
            | Database["public"]["Enums"]["forma_pagamento"]
            | null
          id?: string
          numero?: string
          observacoes?: string | null
          os_id?: string | null
          status?: Database["public"]["Enums"]["status_conta"]
          tentativas_cobranca?: number | null
          ultima_cobranca?: string | null
          updated_at?: string | null
          valor?: number
          valor_pago?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "contas_receber_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contas_receber_os_id_fkey"
            columns: ["os_id"]
            isOneToOne: false
            referencedRelation: "ordens_servico"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          action_url: string | null
          created_at: string | null
          entity_id: string | null
          entity_type: string | null
          id: string
          message: string
          read_at: string | null
          status: Database["public"]["Enums"]["notification_status"]
          title: string
          type: Database["public"]["Enums"]["notification_type"]
          user_id: string
        }
        Insert: {
          action_url?: string | null
          created_at?: string | null
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          message: string
          read_at?: string | null
          status?: Database["public"]["Enums"]["notification_status"]
          title: string
          type?: Database["public"]["Enums"]["notification_type"]
          user_id: string
        }
        Update: {
          action_url?: string | null
          created_at?: string | null
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          message?: string
          read_at?: string | null
          status?: Database["public"]["Enums"]["notification_status"]
          title?: string
          type?: Database["public"]["Enums"]["notification_type"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      ordens_servico: {
        Row: {
          categoria: Database["public"]["Enums"]["categoria_os"]
          cliente_id: string
          created_at: string | null
          data_abertura: string | null
          data_conclusao: string | null
          data_inicio: string | null
          data_vencimento: string | null
          descricao: string
          id: string
          numero: string
          observacoes: string | null
          prioridade: Database["public"]["Enums"]["prioridade_os"]
          responsavel_id: string | null
          status: Database["public"]["Enums"]["status_os"]
          titulo: string
          updated_at: string | null
          valor_final: number | null
          valor_orcado: number | null
        }
        Insert: {
          categoria: Database["public"]["Enums"]["categoria_os"]
          cliente_id: string
          created_at?: string | null
          data_abertura?: string | null
          data_conclusao?: string | null
          data_inicio?: string | null
          data_vencimento?: string | null
          descricao: string
          id?: string
          numero: string
          observacoes?: string | null
          prioridade?: Database["public"]["Enums"]["prioridade_os"]
          responsavel_id?: string | null
          status?: Database["public"]["Enums"]["status_os"]
          titulo: string
          updated_at?: string | null
          valor_final?: number | null
          valor_orcado?: number | null
        }
        Update: {
          categoria?: Database["public"]["Enums"]["categoria_os"]
          cliente_id?: string
          created_at?: string | null
          data_abertura?: string | null
          data_conclusao?: string | null
          data_inicio?: string | null
          data_vencimento?: string | null
          descricao?: string
          id?: string
          numero?: string
          observacoes?: string | null
          prioridade?: Database["public"]["Enums"]["prioridade_os"]
          responsavel_id?: string | null
          status?: Database["public"]["Enums"]["status_os"]
          titulo?: string
          updated_at?: string | null
          valor_final?: number | null
          valor_orcado?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "ordens_servico_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ordens_servico_responsavel_id_fkey"
            columns: ["responsavel_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      system_settings: {
        Row: {
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          key: string
          updated_at: string | null
          value: Json
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          key: string
          updated_at?: string | null
          value: Json
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          key?: string
          updated_at?: string | null
          value?: Json
        }
        Relationships: [
          {
            foreignKeyName: "system_settings_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          avatar: string | null
          company: string | null
          created_at: string | null
          document: string | null
          email: string
          email_verified: boolean | null
          id: string
          is_active: boolean | null
          last_login: string | null
          name: string
          password_hash: string
          phone: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string | null
        }
        Insert: {
          avatar?: string | null
          company?: string | null
          created_at?: string | null
          document?: string | null
          email: string
          email_verified?: boolean | null
          id?: string
          is_active?: boolean | null
          last_login?: string | null
          name: string
          password_hash: string
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
        }
        Update: {
          avatar?: string | null
          company?: string | null
          created_at?: string | null
          document?: string | null
          email?: string
          email_verified?: boolean | null
          id?: string
          is_active?: boolean | null
          last_login?: string | null
          name?: string
          password_hash?: string
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_financial_dashboard: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      get_os_stats: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
    }
    Enums: {
      categoria_despesa:
        | "licencas"
        | "equipamentos"
        | "aluguel"
        | "salarios"
        | "marketing"
        | "contabilidade"
        | "outros"
      categoria_os:
        | "lgpd"
        | "infraestrutura"
        | "backup"
        | "seguranca"
        | "consultoria"
        | "manutencao"
      categoria_receita:
        | "lgpd"
        | "infraestrutura"
        | "backup"
        | "seguranca"
        | "consultoria"
        | "manutencao"
      forma_pagamento:
        | "pix"
        | "boleto"
        | "cartao"
        | "dinheiro"
        | "transferencia"
      notification_status: "unread" | "read" | "archived"
      notification_type: "info" | "warning" | "error" | "success"
      prioridade_os: "baixa" | "media" | "alta" | "critica"
      prioridade_pagamento: "baixa" | "media" | "alta" | "critica"
      status_conta: "pendente" | "pago" | "vencido" | "parcial" | "cancelado"
      status_os:
        | "pendente"
        | "em_andamento"
        | "aguardando_cliente"
        | "concluida"
        | "cancelada"
      user_role: "superadmin" | "admin" | "funcionario" | "cliente"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

// Tipos específicos para facilitar o uso
export type UserRole = Database["public"]["Enums"]["user_role"]
export type StatusOS = Database["public"]["Enums"]["status_os"]
export type PrioridadeOS = Database["public"]["Enums"]["prioridade_os"]
export type CategoriaOS = Database["public"]["Enums"]["categoria_os"]
export type StatusConta = Database["public"]["Enums"]["status_conta"]
export type FormaPagamento = Database["public"]["Enums"]["forma_pagamento"]

export type User = Tables<"users">
export type OrdemServico = Tables<"ordens_servico">
export type ContaReceber = Tables<"contas_receber">
export type ContaPagar = Tables<"contas_pagar">
export type Notification = Tables<"notifications">
export type ActivityLog = Tables<"activity_logs">
export type SystemSetting = Tables<"system_settings">
export type Attachment = Tables<"attachments">

export type UserInsert = TablesInsert<"users">
export type OrdemServicoInsert = TablesInsert<"ordens_servico">
export type ContaReceberInsert = TablesInsert<"contas_receber">
export type ContaPagarInsert = TablesInsert<"contas_pagar">

export type UserUpdate = TablesUpdate<"users">
export type OrdemServicoUpdate = TablesUpdate<"ordens_servico">
export type ContaReceberUpdate = TablesUpdate<"contas_receber">
export type ContaPagarUpdate = TablesUpdate<"contas_pagar"> 