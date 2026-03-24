"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Edit2, Plus, Trash2 } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { api } from "@/lib/api"

interface Pack {
  id: string
  name: string
  price: number
  description: string
  capacity: number
  is_active: boolean
}

export default function PacksPage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [packs, setPacks] = useState<Pack[]>([])
  const [selectedPack, setSelectedPack] = useState<Pack | null>(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editData, setEditData] = useState({ name: "", price: "", description: "", capacity: "" })
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [deleteConfirmPack, setDeleteConfirmPack] = useState<Pack | null>(null)

  useEffect(() => {
    const token = localStorage.getItem("admin_token")
    if (!token) {
      router.push("/admin/login")
    } else {
      setIsAuthenticated(true)
      loadPacks()
    }
  }, [router])

  const loadPacks = async () => {
    try {
      setError(null)
      setIsLoading(true)
      const response = await fetch(`${api.baseURL}/packs?is_active=true`)
      const result = await response.json()

      if (result.status === 200) {
        const packsList = result.data.packs || result.data
        setPacks(Array.isArray(packsList) ? packsList : [])
      } else {
        setError("Failed to load packs")
      }
    } catch (err) {
      console.error("[v0] Error loading packs:", err)
      setError("Error loading packs")
    } finally {
      setIsLoading(false)
    }
  }

  const handleEditClick = (pack: Pack) => {
    setSelectedPack(pack)
    setEditData({
      name: pack.name,
      price: pack.price.toString(),
      description: pack.description,
      capacity: pack.capacity?.toString() || "",
    })
    setShowEditModal(true)
  }

  const handleCreateClick = () => {
    setEditData({ name: "", price: "", description: "", capacity: "" })
    setSelectedPack(null)
    setShowCreateModal(true)
  }

  const handleSaveChanges = async () => {
    if (!selectedPack) return

    try {
      setIsSaving(true)
      setError(null)

      const updateData = {
        name: editData.name || selectedPack.name,
        price: Number.parseInt(editData.price) || selectedPack.price,
        description: editData.description || selectedPack.description,
        capacity: editData.capacity ? Number.parseInt(editData.capacity) : selectedPack.capacity,
      }

      const response = await fetch(`${api.baseURL}/packs/${selectedPack.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
        },
        body: JSON.stringify(updateData),
      })

      const result = await response.json()

      if (result.status === 200) {
        setSuccess("Pack updated successfully")
        await loadPacks()
        setShowEditModal(false)
      } else {
        setError(result.message || "Failed to update pack")
      }
    } catch (err) {
      console.error("[v0] Error updating pack:", err)
      setError("Error updating pack")
    } finally {
      setIsSaving(false)
    }
  }

  const handleCreatePack = async () => {
    if (!editData.name || !editData.price) {
      setError("Name and price are required")
      return
    }

    try {
      setIsSaving(true)
      setError(null)

      const newPackData = {
        name: editData.name,
        price: Number.parseInt(editData.price),
        description: editData.description,
        capacity: editData.capacity ? Number.parseInt(editData.capacity) : null,
      }

      const response = await fetch(`${api.baseURL}/packs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
        },
        body: JSON.stringify(newPackData),
      })

      const result = await response.json()

      if (result.status === 201) {
        setSuccess("Pack created successfully")
        await loadPacks()
        setShowCreateModal(false)
      } else {
        setError(result.message || "Failed to create pack")
      }
    } catch (err) {
      console.error("[v0] Error creating pack:", err)
      setError("Error creating pack")
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeletePack = async (packId: string) => {
    try {
      setError(null)
      const response = await fetch(`${api.baseURL}/packs/${packId}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
        },
      })

      const result = await response.json()

      if (result.status === 200) {
        setSuccess("Pack supprimé avec succès")
        setDeleteConfirmPack(null)
        await loadPacks()
      } else {
        setError(result.message || "Échec de la suppression")
      }
    } catch (err) {
      console.error("[v0] Error deleting pack:", err)
      setError("Erreur lors de la suppression")
    }
  }

  if (isLoading || !isAuthenticated) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-12">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Gestion des packs</h1>
            <p className="text-muted-foreground">Modifiez, créez ou supprimez les packs</p>
          </div>
          <button
            onClick={handleCreateClick}
            className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-accent text-primary-foreground rounded-md transition-colors font-medium"
          >
            <Plus className="w-4 h-4" />
            Créer un pack
          </button>
        </div>

        {/* Packs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {packs.map((pack) => (
            <div
              key={pack.id}
              className="bg-card border border-border rounded-lg p-6 hover:border-primary/50 transition-colors"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-foreground">{pack.name}</h2>
                  <p className="text-2xl font-bold text-primary mt-1">{pack.price.toLocaleString()} XAF</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEditClick(pack)}
                    className="p-2 hover:bg-secondary rounded-md transition-colors text-foreground"
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setDeleteConfirmPack(pack)}
                    className="p-2 hover:bg-red-500/20 rounded-md transition-colors text-red-600"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <p className="text-sm text-muted-foreground mb-4">{pack.description}</p>

              {pack.capacity && (
                <div className="bg-secondary p-2 rounded text-sm text-foreground">
                  Capacité: {pack.capacity} participant(s)
                </div>
              )}
            </div>
          ))}
        </div>

        {error && <div className="bg-red-100 border border-red-400 text-red-900 px-4 py-3 rounded">{error}</div>}
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-900 px-4 py-3 rounded">{success}</div>
        )}

        {packs.length === 0 ? (
          <div className="bg-card border border-border rounded-lg p-16 text-center">
            <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mx-auto mb-4">
              <Plus className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-foreground font-medium mb-1">Aucun pack configuré</p>
            <p className="text-muted-foreground text-sm mb-6">Créez votre premier pack pour commencer à recevoir des réservations</p>
            <button
              onClick={handleCreateClick}
              className="px-4 py-2 bg-primary hover:bg-accent text-primary-foreground rounded-md transition-colors font-medium"
            >
              Créer le premier pack
            </button>
          </div>
        ) : null}
      </div>

      {/* Edit Modal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="bg-card border border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground">Modifier {selectedPack?.name}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Nom</label>
              <input
                type="text"
                value={editData.name}
                onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                className="w-full px-3 py-2 bg-input border border-border rounded-md text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Prix (XAF)</label>
              <input
                type="number"
                value={editData.price}
                onChange={(e) => setEditData({ ...editData, price: e.target.value })}
                className="w-full px-3 py-2 bg-input border border-border rounded-md text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Description</label>
              <input
                type="text"
                value={editData.description}
                onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                className="w-full px-3 py-2 bg-input border border-border rounded-md text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Capacité (optionnel)</label>
              <input
                type="number"
                value={editData.capacity}
                onChange={(e) => setEditData({ ...editData, capacity: e.target.value })}
                className="w-full px-3 py-2 bg-input border border-border rounded-md text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50"
              />
            </div>
          </div>

          <DialogFooter>
            <button
              onClick={() => setShowEditModal(false)}
              className="px-4 py-2 bg-secondary hover:bg-secondary/80 text-foreground rounded-md transition-colors font-medium text-sm"
            >
              Annuler
            </button>
            <button
              onClick={handleSaveChanges}
              disabled={isSaving}
              className="px-4 py-2 bg-primary hover:bg-accent text-primary-foreground rounded-md transition-colors font-medium text-sm disabled:opacity-50"
            >
              {isSaving ? "Enregistrement..." : "Enregistrer"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Modal */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="bg-card border border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground">Créer un nouveau pack</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Nom *</label>
              <input
                type="text"
                value={editData.name}
                onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                className="w-full px-3 py-2 bg-input border border-border rounded-md text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50"
                placeholder="Ex: Pack VIP"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Prix (XAF) *</label>
              <input
                type="number"
                value={editData.price}
                onChange={(e) => setEditData({ ...editData, price: e.target.value })}
                className="w-full px-3 py-2 bg-input border border-border rounded-md text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50"
                placeholder="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Description</label>
              <input
                type="text"
                value={editData.description}
                onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                className="w-full px-3 py-2 bg-input border border-border rounded-md text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50"
                placeholder="Description du pack"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Capacité (optionnel)</label>
              <input
                type="number"
                value={editData.capacity}
                onChange={(e) => setEditData({ ...editData, capacity: e.target.value })}
                className="w-full px-3 py-2 bg-input border border-border rounded-md text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50"
                placeholder="Nombre de participants"
              />
            </div>
          </div>

          <DialogFooter>
            <button
              onClick={() => setShowCreateModal(false)}
              className="px-4 py-2 bg-secondary hover:bg-secondary/80 text-foreground rounded-md transition-colors font-medium text-sm"
            >
              Annuler
            </button>
            <button
              onClick={handleCreatePack}
              disabled={isSaving}
              className="px-4 py-2 bg-primary hover:bg-accent text-primary-foreground rounded-md transition-colors font-medium text-sm disabled:opacity-50"
            >
              {isSaving ? "Création..." : "Créer"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteConfirmPack} onOpenChange={(open) => !open && setDeleteConfirmPack(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Supprimer le pack</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground py-4">
            Êtes-vous sûr de vouloir supprimer le pack{" "}
            <span className="font-semibold text-foreground">"{deleteConfirmPack?.name}"</span> ?
            Cette action est irréversible.
          </p>
          <DialogFooter>
            <button
              onClick={() => setDeleteConfirmPack(null)}
              className="px-4 py-2 bg-secondary hover:bg-secondary/80 text-foreground rounded-md transition-colors font-medium text-sm"
            >
              Annuler
            </button>
            <button
              onClick={() => deleteConfirmPack && handleDeletePack(deleteConfirmPack.id)}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors font-medium text-sm"
            >
              Supprimer
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  )
}
