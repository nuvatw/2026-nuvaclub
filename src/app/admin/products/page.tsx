'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/features/auth/components/AuthProvider';
import { Button } from '@/components/atoms';
import {
  PlusIcon,
  EditIcon,
  TrashIcon,
  CheckIcon,
  XIcon,
  SpinnerIcon,
} from '@/components/icons';
import { cn } from '@/lib/utils';

interface AdminProduct {
  id: string;
  type: 'event' | 'merchandise' | 'plan';
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function AdminProductsPage() {
  const { currentAccountId } = useAuth();
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<AdminProduct | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    type: 'merchandise' as 'event' | 'merchandise' | 'plan',
    name: '',
    description: '',
    price: 0,
    imageUrl: '',
    isPublished: true,
  });
  const [formLoading, setFormLoading] = useState(false);

  // Fetch products
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/products', {
        headers: { 'x-admin-user': currentAccountId },
      });
      if (!response.ok) throw new Error('Failed to fetch products');
      const data = await response.json();
      setProducts(data.products);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [currentAccountId]);

  // Create product
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setFormLoading(true);
      const response = await fetch('/api/admin/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-user': currentAccountId,
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error('Failed to create product');
      await fetchProducts();
      setShowCreateForm(false);
      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create product');
    } finally {
      setFormLoading(false);
    }
  };

  // Update product
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    try {
      setFormLoading(true);
      const response = await fetch('/api/admin/products', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-user': currentAccountId,
        },
        body: JSON.stringify({ id: editingProduct.id, ...formData }),
      });
      if (!response.ok) throw new Error('Failed to update product');
      await fetchProducts();
      setEditingProduct(null);
      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update product');
    } finally {
      setFormLoading(false);
    }
  };

  // Toggle publish status
  const handleTogglePublish = async (product: AdminProduct) => {
    try {
      const response = await fetch('/api/admin/products', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-user': currentAccountId,
        },
        body: JSON.stringify({ id: product.id, isPublished: !product.isPublished }),
      });
      if (!response.ok) throw new Error('Failed to update product');
      await fetchProducts();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update product');
    }
  };

  // Delete product
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      const response = await fetch(`/api/admin/products?id=${id}`, {
        method: 'DELETE',
        headers: { 'x-admin-user': currentAccountId },
      });
      if (!response.ok) throw new Error('Failed to delete product');
      await fetchProducts();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete product');
    }
  };

  const resetForm = () => {
    setFormData({
      type: 'merchandise',
      name: '',
      description: '',
      price: 0,
      imageUrl: '',
      isPublished: true,
    });
  };

  const startEdit = (product: AdminProduct) => {
    setEditingProduct(product);
    setFormData({
      type: product.type,
      name: product.name,
      description: product.description,
      price: product.price,
      imageUrl: product.imageUrl,
      isPublished: product.isPublished,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Manage Products</h1>
          <p className="text-neutral-400 mt-1">Create, edit, and manage shop products</p>
        </div>
        <Button onClick={() => setShowCreateForm(true)} className="gap-2">
          <PlusIcon size="sm" />
          Add Product
        </Button>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-red-400">
          {error}
          <button onClick={() => setError(null)} className="ml-2 underline">
            Dismiss
          </button>
        </div>
      )}

      {/* Create/Edit Form Modal */}
      {(showCreateForm || editingProduct) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-neutral-900 rounded-xl border border-neutral-700 p-6 w-full max-w-lg mx-4">
            <h2 className="text-xl font-semibold text-white mb-4">
              {editingProduct ? 'Edit Product' : 'Create Product'}
            </h2>
            <form onSubmit={editingProduct ? handleUpdate : handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-1">Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                  className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500"
                >
                  <option value="merchandise">Merchandise</option>
                  <option value="event">Event</option>
                  <option value="plan">Plan</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-1">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-1">Price (TWD)</label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500"
                  min="0"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-1">Image URL</label>
                <input
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500"
                  placeholder="https://..."
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isPublished"
                  checked={formData.isPublished}
                  onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                  className="w-4 h-4 rounded border-neutral-700 bg-neutral-800 text-amber-500 focus:ring-amber-500/50"
                />
                <label htmlFor="isPublished" className="text-sm text-neutral-300">
                  Published (visible to users)
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    setShowCreateForm(false);
                    setEditingProduct(null);
                    resetForm();
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={formLoading}>
                  {formLoading ? (
                    <SpinnerIcon size="sm" className="mr-2" />
                  ) : editingProduct ? (
                    'Save Changes'
                  ) : (
                    'Create Product'
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Products Table */}
      {loading ? (
        <div className="flex justify-center py-12">
          <SpinnerIcon size="lg" className="text-amber-400" />
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-12 text-neutral-500">
          No products created yet. Click &quot;Add Product&quot; to create one.
        </div>
      ) : (
        <div className="bg-neutral-900 rounded-xl border border-neutral-800 overflow-hidden">
          <table className="w-full">
            <thead className="bg-neutral-800/50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-neutral-400">Name</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-neutral-400">Type</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-neutral-400">Price</th>
                <th className="px-4 py-3 text-center text-sm font-medium text-neutral-400">Status</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-neutral-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-neutral-800/30 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {product.imageUrl && (
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="w-10 h-10 rounded-lg object-cover"
                        />
                      )}
                      <div>
                        <div className="font-medium text-white">{product.name}</div>
                        <div className="text-xs text-neutral-500 truncate max-w-xs">
                          {product.description}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={cn(
                      'inline-flex px-2 py-1 text-xs font-medium rounded-full',
                      product.type === 'event' && 'bg-blue-500/20 text-blue-400',
                      product.type === 'merchandise' && 'bg-purple-500/20 text-purple-400',
                      product.type === 'plan' && 'bg-green-500/20 text-green-400'
                    )}>
                      {product.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-neutral-300">
                    NT${product.price.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => handleTogglePublish(product)}
                      className={cn(
                        'inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full transition-colors',
                        product.isPublished
                          ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                          : 'bg-neutral-700 text-neutral-400 hover:bg-neutral-600'
                      )}
                      aria-label={product.isPublished ? 'Click to unpublish' : 'Click to publish'}
                    >
                      {product.isPublished ? (
                        <>
                          <CheckIcon size="sm" />
                          Published
                        </>
                      ) : (
                        <>
                          <XIcon size="sm" />
                          Draft
                        </>
                      )}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => startEdit(product)}
                        className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-700 rounded-lg transition-colors"
                        aria-label="Edit product"
                      >
                        <EditIcon size="sm" />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-lg transition-colors"
                        aria-label="Delete product"
                      >
                        <TrashIcon size="sm" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
