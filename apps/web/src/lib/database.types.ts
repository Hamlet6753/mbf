export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      band_member_history: {
        Row: {
          band_id: number
          created_at: string | null
          custom_label: string | null
          id: number
          joined_at: string | null
          left_at: string
          musician_id: number
          reason: string | null
          role_id: number | null
        }
        Insert: {
          band_id: number
          created_at?: string | null
          custom_label?: string | null
          id?: number
          joined_at?: string | null
          left_at?: string
          musician_id: number
          reason?: string | null
          role_id?: number | null
        }
        Update: {
          band_id?: number
          created_at?: string | null
          custom_label?: string | null
          id?: number
          joined_at?: string | null
          left_at?: string
          musician_id?: number
          reason?: string | null
          role_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "band_member_history_band_id_fkey"
            columns: ["band_id"]
            isOneToOne: false
            referencedRelation: "bands"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "band_member_history_musician_id_fkey"
            columns: ["musician_id"]
            isOneToOne: false
            referencedRelation: "musicians"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "band_member_history_musician_id_fkey"
            columns: ["musician_id"]
            isOneToOne: false
            referencedRelation: "public_musician_genres"
            referencedColumns: ["musician_id"]
          },
          {
            foreignKeyName: "band_member_history_musician_id_fkey"
            columns: ["musician_id"]
            isOneToOne: false
            referencedRelation: "public_musician_instrument_variants"
            referencedColumns: ["musician_id"]
          },
          {
            foreignKeyName: "band_member_history_musician_id_fkey"
            columns: ["musician_id"]
            isOneToOne: false
            referencedRelation: "public_musician_instruments"
            referencedColumns: ["musician_id"]
          },
          {
            foreignKeyName: "band_member_history_musician_id_fkey"
            columns: ["musician_id"]
            isOneToOne: false
            referencedRelation: "public_musician_roles"
            referencedColumns: ["musician_id"]
          },
          {
            foreignKeyName: "band_member_history_musician_id_fkey"
            columns: ["musician_id"]
            isOneToOne: false
            referencedRelation: "public_musician_subgenres"
            referencedColumns: ["musician_id"]
          },
          {
            foreignKeyName: "band_member_history_musician_id_fkey"
            columns: ["musician_id"]
            isOneToOne: false
            referencedRelation: "public_musicians"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "band_member_history_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
      band_members: {
        Row: {
          band_id: number
          custom_label: string | null
          id: number
          joined_at: string | null
          member_role: string
          musician_id: number
          role_id: number | null
        }
        Insert: {
          band_id: number
          custom_label?: string | null
          id?: number
          joined_at?: string | null
          member_role: string
          musician_id: number
          role_id?: number | null
        }
        Update: {
          band_id?: number
          custom_label?: string | null
          id?: number
          joined_at?: string | null
          member_role?: string
          musician_id?: number
          role_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "band_members_band_id_fkey"
            columns: ["band_id"]
            isOneToOne: false
            referencedRelation: "bands"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "band_members_musician_id_fkey"
            columns: ["musician_id"]
            isOneToOne: false
            referencedRelation: "musicians"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "band_members_musician_id_fkey"
            columns: ["musician_id"]
            isOneToOne: false
            referencedRelation: "public_musician_genres"
            referencedColumns: ["musician_id"]
          },
          {
            foreignKeyName: "band_members_musician_id_fkey"
            columns: ["musician_id"]
            isOneToOne: false
            referencedRelation: "public_musician_instrument_variants"
            referencedColumns: ["musician_id"]
          },
          {
            foreignKeyName: "band_members_musician_id_fkey"
            columns: ["musician_id"]
            isOneToOne: false
            referencedRelation: "public_musician_instruments"
            referencedColumns: ["musician_id"]
          },
          {
            foreignKeyName: "band_members_musician_id_fkey"
            columns: ["musician_id"]
            isOneToOne: false
            referencedRelation: "public_musician_roles"
            referencedColumns: ["musician_id"]
          },
          {
            foreignKeyName: "band_members_musician_id_fkey"
            columns: ["musician_id"]
            isOneToOne: false
            referencedRelation: "public_musician_subgenres"
            referencedColumns: ["musician_id"]
          },
          {
            foreignKeyName: "band_members_musician_id_fkey"
            columns: ["musician_id"]
            isOneToOne: false
            referencedRelation: "public_musicians"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "band_members_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
      band_search_roles: {
        Row: {
          band_id: number
          role_id: number
        }
        Insert: {
          band_id: number
          role_id: number
        }
        Update: {
          band_id?: number
          role_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "band_search_roles_band_id_fkey"
            columns: ["band_id"]
            isOneToOne: false
            referencedRelation: "bands"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "band_search_roles_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
      band_subgenres: {
        Row: {
          band_id: number
          subgenre_id: number
        }
        Insert: {
          band_id: number
          subgenre_id: number
        }
        Update: {
          band_id?: number
          subgenre_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "band_subgenres_band_id_fkey"
            columns: ["band_id"]
            isOneToOne: false
            referencedRelation: "bands"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "band_subgenres_subgenre_id_fkey"
            columns: ["subgenre_id"]
            isOneToOne: false
            referencedRelation: "subgenres"
            referencedColumns: ["id"]
          },
        ]
      }
      band_videos: {
        Row: {
          band_id: number
          created_at: string | null
          id: number
          position: number
          title: string | null
          url: string
        }
        Insert: {
          band_id: number
          created_at?: string | null
          id?: number
          position?: number
          title?: string | null
          url: string
        }
        Update: {
          band_id?: number
          created_at?: string | null
          id?: number
          position?: number
          title?: string | null
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "band_videos_band_id_fkey"
            columns: ["band_id"]
            isOneToOne: false
            referencedRelation: "bands"
            referencedColumns: ["id"]
          },
        ]
      }
      bands: {
        Row: {
          background_picture: string | null
          created_at: string
          date_end: string | null
          description: string | null
          hiring: boolean
          id: number
          name: string
          picture: string | null
          website: string | null
        }
        Insert: {
          background_picture?: string | null
          created_at?: string
          date_end?: string | null
          description?: string | null
          hiring?: boolean
          id?: number
          name: string
          picture?: string | null
          website?: string | null
        }
        Update: {
          background_picture?: string | null
          created_at?: string
          date_end?: string | null
          description?: string | null
          hiring?: boolean
          id?: number
          name?: string
          picture?: string | null
          website?: string | null
        }
        Relationships: []
      }
      genres: {
        Row: {
          created_at: string
          id: number
          name: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          name?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          name?: string | null
        }
        Relationships: []
      }
      instrument_variants: {
        Row: {
          id: number
          instrument_id: number
          name: string
        }
        Insert: {
          id?: number
          instrument_id: number
          name: string
        }
        Update: {
          id?: number
          instrument_id?: number
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "instrument_variants_instrument_id_fkey"
            columns: ["instrument_id"]
            isOneToOne: false
            referencedRelation: "instruments"
            referencedColumns: ["id"]
          },
        ]
      }
      instruments: {
        Row: {
          created_at: string
          id: number
          name: string
        }
        Insert: {
          created_at?: string
          id?: number
          name: string
        }
        Update: {
          created_at?: string
          id?: number
          name?: string
        }
        Relationships: []
      }
      musician_genres: {
        Row: {
          genre_id: number
          id: number
          musician_id: string
        }
        Insert: {
          genre_id: number
          id?: number
          musician_id: string
        }
        Update: {
          genre_id?: number
          id?: number
          musician_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "musician_genres_genre_id_fkey"
            columns: ["genre_id"]
            isOneToOne: false
            referencedRelation: "genres"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "musician_genres_genre_id_fkey"
            columns: ["genre_id"]
            isOneToOne: false
            referencedRelation: "genres_with_subgenres"
            referencedColumns: ["genre_id"]
          },
          {
            foreignKeyName: "musician_genres_musician_id_fkey"
            columns: ["musician_id"]
            isOneToOne: false
            referencedRelation: "musicians"
            referencedColumns: ["user_id"]
          },
        ]
      }
      musician_instrument_variants: {
        Row: {
          id: number
          musician_id: string
          variant_id: number
        }
        Insert: {
          id?: number
          musician_id: string
          variant_id: number
        }
        Update: {
          id?: number
          musician_id?: string
          variant_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "musician_instrument_variants_musician_id_fkey"
            columns: ["musician_id"]
            isOneToOne: false
            referencedRelation: "musicians"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "musician_instrument_variants_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "instrument_variants"
            referencedColumns: ["id"]
          },
        ]
      }
      musician_instruments: {
        Row: {
          id: number
          instrument_id: number
          musician_id: string
        }
        Insert: {
          id?: number
          instrument_id: number
          musician_id: string
        }
        Update: {
          id?: number
          instrument_id?: number
          musician_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "musician_instruments_instrument_id_fkey"
            columns: ["instrument_id"]
            isOneToOne: false
            referencedRelation: "instruments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "musician_instruments_musician_id_fkey"
            columns: ["musician_id"]
            isOneToOne: false
            referencedRelation: "musicians"
            referencedColumns: ["user_id"]
          },
        ]
      }
      musician_roles: {
        Row: {
          id: number
          musician_id: string
          role_id: number
        }
        Insert: {
          id?: number
          musician_id: string
          role_id: number
        }
        Update: {
          id?: number
          musician_id?: string
          role_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "musician_roles_musician_id_fkey"
            columns: ["musician_id"]
            isOneToOne: false
            referencedRelation: "musicians"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "musician_roles_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
      musician_subgenres: {
        Row: {
          id: number
          musician_id: string
          subgenre_id: number
        }
        Insert: {
          id?: number
          musician_id: string
          subgenre_id: number
        }
        Update: {
          id?: number
          musician_id?: string
          subgenre_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "musician_subgenres_musician_id_fkey"
            columns: ["musician_id"]
            isOneToOne: false
            referencedRelation: "musicians"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "musician_subgenres_subgenre_id_fkey"
            columns: ["subgenre_id"]
            isOneToOne: false
            referencedRelation: "subgenres"
            referencedColumns: ["id"]
          },
        ]
      }
      musician_video_tags: {
        Row: {
          tag_id: number
          video_id: number
        }
        Insert: {
          tag_id: number
          video_id: number
        }
        Update: {
          tag_id?: number
          video_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "musician_video_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "video_tags"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "musician_video_tags_video_id_fkey"
            columns: ["video_id"]
            isOneToOne: false
            referencedRelation: "musician_videos"
            referencedColumns: ["id"]
          },
        ]
      }
      musician_videos: {
        Row: {
          created_at: string | null
          id: number
          musician_id: number
          position: number
          title: string | null
          url: string
        }
        Insert: {
          created_at?: string | null
          id?: number
          musician_id: number
          position?: number
          title?: string | null
          url: string
        }
        Update: {
          created_at?: string | null
          id?: number
          musician_id?: number
          position?: number
          title?: string | null
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "musician_videos_musician_id_fkey"
            columns: ["musician_id"]
            isOneToOne: false
            referencedRelation: "musicians"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "musician_videos_musician_id_fkey"
            columns: ["musician_id"]
            isOneToOne: false
            referencedRelation: "public_musician_genres"
            referencedColumns: ["musician_id"]
          },
          {
            foreignKeyName: "musician_videos_musician_id_fkey"
            columns: ["musician_id"]
            isOneToOne: false
            referencedRelation: "public_musician_instrument_variants"
            referencedColumns: ["musician_id"]
          },
          {
            foreignKeyName: "musician_videos_musician_id_fkey"
            columns: ["musician_id"]
            isOneToOne: false
            referencedRelation: "public_musician_instruments"
            referencedColumns: ["musician_id"]
          },
          {
            foreignKeyName: "musician_videos_musician_id_fkey"
            columns: ["musician_id"]
            isOneToOne: false
            referencedRelation: "public_musician_roles"
            referencedColumns: ["musician_id"]
          },
          {
            foreignKeyName: "musician_videos_musician_id_fkey"
            columns: ["musician_id"]
            isOneToOne: false
            referencedRelation: "public_musician_subgenres"
            referencedColumns: ["musician_id"]
          },
          {
            foreignKeyName: "musician_videos_musician_id_fkey"
            columns: ["musician_id"]
            isOneToOne: false
            referencedRelation: "public_musicians"
            referencedColumns: ["id"]
          },
        ]
      }
      musicians: {
        Row: {
          available: boolean | null
          background_picture: string | null
          bio: string | null
          birthdate: string | null
          created_at: string
          custom_genre: string | null
          email: string | null
          experience: string | null
          firstname: string | null
          gender: Database["public"]["Enums"]["gender_enum"] | null
          has_musical_education: boolean
          id: number
          in_search: boolean | null
          is_onboarded: boolean | null
          is_published: boolean
          lastname: string | null
          musical_education_details: string | null
          picture: string | null
          place_id: number | null
          updated_at: string
          user_id: string | null
          username: string | null
          website: string | null
        }
        Insert: {
          available?: boolean | null
          background_picture?: string | null
          bio?: string | null
          birthdate?: string | null
          created_at?: string
          custom_genre?: string | null
          email?: string | null
          experience?: string | null
          firstname?: string | null
          gender?: Database["public"]["Enums"]["gender_enum"] | null
          has_musical_education?: boolean
          id?: number
          in_search?: boolean | null
          is_onboarded?: boolean | null
          is_published?: boolean
          lastname?: string | null
          musical_education_details?: string | null
          picture?: string | null
          place_id?: number | null
          updated_at?: string
          user_id?: string | null
          username?: string | null
          website?: string | null
        }
        Update: {
          available?: boolean | null
          background_picture?: string | null
          bio?: string | null
          birthdate?: string | null
          created_at?: string
          custom_genre?: string | null
          email?: string | null
          experience?: string | null
          firstname?: string | null
          gender?: Database["public"]["Enums"]["gender_enum"] | null
          has_musical_education?: boolean
          id?: number
          in_search?: boolean | null
          is_onboarded?: boolean | null
          is_published?: boolean
          lastname?: string | null
          musical_education_details?: string | null
          picture?: string | null
          place_id?: number | null
          updated_at?: string
          user_id?: string | null
          username?: string | null
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "musicians_place_id_fkey"
            columns: ["place_id"]
            isOneToOne: false
            referencedRelation: "places"
            referencedColumns: ["id"]
          },
        ]
      }
      places: {
        Row: {
          city: string | null
          country_code: string
          country_name: string | null
          created_at: string | null
          id: number
          lat: number
          lng: number
          provider: string | null
          provider_place_id: string | null
          region: string | null
        }
        Insert: {
          city?: string | null
          country_code: string
          country_name?: string | null
          created_at?: string | null
          id?: number
          lat: number
          lng: number
          provider?: string | null
          provider_place_id?: string | null
          region?: string | null
        }
        Update: {
          city?: string | null
          country_code?: string
          country_name?: string | null
          created_at?: string | null
          id?: number
          lat?: number
          lng?: number
          provider?: string | null
          provider_place_id?: string | null
          region?: string | null
        }
        Relationships: []
      }
      roles: {
        Row: {
          category: string | null
          id: number
          is_active: boolean
          name: string
        }
        Insert: {
          category?: string | null
          id?: number
          is_active?: boolean
          name: string
        }
        Update: {
          category?: string | null
          id?: number
          is_active?: boolean
          name?: string
        }
        Relationships: []
      }
      subgenres: {
        Row: {
          genre_id: number
          id: number
          name: string
        }
        Insert: {
          genre_id: number
          id?: number
          name: string
        }
        Update: {
          genre_id?: number
          id?: number
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "subgenres_genre_id_fkey"
            columns: ["genre_id"]
            isOneToOne: false
            referencedRelation: "genres"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subgenres_genre_id_fkey"
            columns: ["genre_id"]
            isOneToOne: false
            referencedRelation: "genres_with_subgenres"
            referencedColumns: ["genre_id"]
          },
        ]
      }
      video_tag_categories: {
        Row: {
          description: string | null
          id: number
          name: string
        }
        Insert: {
          description?: string | null
          id?: number
          name: string
        }
        Update: {
          description?: string | null
          id?: number
          name?: string
        }
        Relationships: []
      }
      video_tags: {
        Row: {
          category_id: number
          description: string | null
          id: number
          name: string
        }
        Insert: {
          category_id: number
          description?: string | null
          id?: number
          name: string
        }
        Update: {
          category_id?: number
          description?: string | null
          id?: number
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "video_tags_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "video_tag_categories"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      genres_with_subgenres: {
        Row: {
          genre_id: number | null
          genre_name: string | null
          subgenres: Json | null
        }
        Relationships: []
      }
      public_musician_genres: {
        Row: {
          genre_id: number | null
          musician_id: number | null
        }
        Relationships: [
          {
            foreignKeyName: "musician_genres_genre_id_fkey"
            columns: ["genre_id"]
            isOneToOne: false
            referencedRelation: "genres"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "musician_genres_genre_id_fkey"
            columns: ["genre_id"]
            isOneToOne: false
            referencedRelation: "genres_with_subgenres"
            referencedColumns: ["genre_id"]
          },
        ]
      }
      public_musician_instrument_variants: {
        Row: {
          musician_id: number | null
          variant_id: number | null
        }
        Relationships: [
          {
            foreignKeyName: "musician_instrument_variants_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "instrument_variants"
            referencedColumns: ["id"]
          },
        ]
      }
      public_musician_instruments: {
        Row: {
          instrument_id: number | null
          musician_id: number | null
        }
        Relationships: [
          {
            foreignKeyName: "musician_instruments_instrument_id_fkey"
            columns: ["instrument_id"]
            isOneToOne: false
            referencedRelation: "instruments"
            referencedColumns: ["id"]
          },
        ]
      }
      public_musician_roles: {
        Row: {
          musician_id: number | null
          role_id: number | null
        }
        Relationships: [
          {
            foreignKeyName: "musician_roles_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
      public_musician_subgenres: {
        Row: {
          musician_id: number | null
          subgenre_id: number | null
        }
        Relationships: [
          {
            foreignKeyName: "musician_subgenres_subgenre_id_fkey"
            columns: ["subgenre_id"]
            isOneToOne: false
            referencedRelation: "subgenres"
            referencedColumns: ["id"]
          },
        ]
      }
      public_musicians: {
        Row: {
          available: boolean | null
          background_picture: string | null
          bio: string | null
          created_at: string | null
          custom_genre: string | null
          experience: string | null
          firstname: string | null
          gender: Database["public"]["Enums"]["gender_enum"] | null
          has_musical_education: boolean | null
          id: number | null
          in_search: boolean | null
          is_published: boolean | null
          lastname: string | null
          musical_education_details: string | null
          picture: string | null
          place_id: number | null
          updated_at: string | null
          username: string | null
          website: string | null
        }
        Insert: {
          available?: boolean | null
          background_picture?: string | null
          bio?: string | null
          created_at?: string | null
          custom_genre?: string | null
          experience?: string | null
          firstname?: string | null
          gender?: Database["public"]["Enums"]["gender_enum"] | null
          has_musical_education?: boolean | null
          id?: number | null
          in_search?: boolean | null
          is_published?: boolean | null
          lastname?: string | null
          musical_education_details?: string | null
          picture?: string | null
          place_id?: number | null
          updated_at?: string | null
          username?: string | null
          website?: string | null
        }
        Update: {
          available?: boolean | null
          background_picture?: string | null
          bio?: string | null
          created_at?: string | null
          custom_genre?: string | null
          experience?: string | null
          firstname?: string | null
          gender?: Database["public"]["Enums"]["gender_enum"] | null
          has_musical_education?: boolean | null
          id?: number | null
          in_search?: boolean | null
          is_published?: boolean | null
          lastname?: string | null
          musical_education_details?: string | null
          picture?: string | null
          place_id?: number | null
          updated_at?: string | null
          username?: string | null
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "musicians_place_id_fkey"
            columns: ["place_id"]
            isOneToOne: false
            referencedRelation: "places"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      add_band_member: {
        Args: {
          p_band_id: number
          p_custom_label?: string
          p_member_role?: string
          p_musician_id: number
          p_role_id?: number
        }
        Returns: {
          band_id: number
          custom_label: string | null
          id: number
          joined_at: string | null
          member_role: string
          musician_id: number
          role_id: number | null
        }
        SetofOptions: {
          from: "*"
          to: "band_members"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      leave_band: { Args: { p_band_id: number }; Returns: undefined }
      remove_band_member: {
        Args: { p_band_id: number; p_musician_id: number }
        Returns: undefined
      }
      save_my_musician_profile: {
        Args: {
          p_genres: number[]
          p_instruments: number[]
          p_profile: Json
          p_publish?: boolean
          p_roles: number[]
          p_subgenres: number[]
          p_variants: number[]
        }
        Returns: {
          available: boolean | null
          background_picture: string | null
          bio: string | null
          birthdate: string | null
          created_at: string
          custom_genre: string | null
          email: string | null
          experience: string | null
          firstname: string | null
          gender: Database["public"]["Enums"]["gender_enum"] | null
          has_musical_education: boolean
          id: number
          in_search: boolean | null
          is_onboarded: boolean | null
          is_published: boolean
          lastname: string | null
          musical_education_details: string | null
          picture: string | null
          place_id: number | null
          updated_at: string
          user_id: string | null
          username: string | null
          website: string | null
        }
        SetofOptions: {
          from: "*"
          to: "musicians"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      search_bands: {
        Args: {
          p_after_id?: number
          p_hiring?: boolean
          p_limit?: number
          p_query?: string
          p_role_ids?: number[]
          p_subgenre_ids?: number[]
        }
        Returns: {
          background_picture: string | null
          created_at: string
          date_end: string | null
          description: string | null
          hiring: boolean
          id: number
          name: string
          picture: string | null
          website: string | null
        }[]
        SetofOptions: {
          from: "*"
          to: "bands"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      search_musicians: {
        Args: {
          p_after_id?: number
          p_available?: boolean
          p_genre_ids?: number[]
          p_in_search?: boolean
          p_instrument_ids?: number[]
          p_limit?: number
          p_place_id?: number
          p_query?: string
          p_role_ids?: number[]
          p_subgenre_ids?: number[]
        }
        Returns: {
          available: boolean | null
          background_picture: string | null
          bio: string | null
          created_at: string | null
          custom_genre: string | null
          experience: string | null
          firstname: string | null
          gender: Database["public"]["Enums"]["gender_enum"] | null
          has_musical_education: boolean | null
          id: number | null
          in_search: boolean | null
          is_published: boolean | null
          lastname: string | null
          musical_education_details: string | null
          picture: string | null
          place_id: number | null
          updated_at: string | null
          username: string | null
          website: string | null
        }[]
        SetofOptions: {
          from: "*"
          to: "public_musicians"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      update_band_member_role: {
        Args: {
          p_band_id: number
          p_custom_label?: string
          p_member_role?: string
          p_musician_id: number
          p_role_id?: number
        }
        Returns: {
          band_id: number
          custom_label: string | null
          id: number
          joined_at: string | null
          member_role: string
          musician_id: number
          role_id: number | null
        }
        SetofOptions: {
          from: "*"
          to: "band_members"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      update_musician_profile:
        | {
            Args: {
              p_background_picture: string
              p_custom_genre: string
              p_edu_details: string
              p_genres: Json
              p_has_edu: boolean
              p_instrument_variants: Json
              p_instruments: Json
              p_roles: Json
              p_subgenres: Json
              p_user_id: string
            }
            Returns: Json
          }
        | {
            Args: {
              p_background_picture: string
              p_custom_genre: string
              p_genres: number[]
              p_has_musical_education: boolean
              p_instrument_variants: number[]
              p_instruments: number[]
              p_is_published: boolean
              p_musical_education_details: string
              p_roles: number[]
              p_subgenres: number[]
              p_user_id: string
            }
            Returns: undefined
          }
    }
    Enums: {
      gender_enum: "male" | "female" | "other"
      skill_level_enum: "beginner" | "intermediate" | "advanced" | "pro"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      gender_enum: ["male", "female", "other"],
      skill_level_enum: ["beginner", "intermediate", "advanced", "pro"],
    },
  },
} as const
