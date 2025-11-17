import React, { useState, useEffect } from 'react';
import { productService } from '../services/productService';

function ProductsPage() {
    const [products, setProducts] = useState([]);
    const [editingProduct, setEditingProduct] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({ name: '', description: '', price: '', stock: '', imageUrl: '' });

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        try {
            setLoading(true);
            const data = await productService.getAllProducts();
            setProducts(data);
            setError(null);
        } catch (err) {
            setError('Erro ao carregar produtos');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingProduct) {
                await productService.updateProduct(editingProduct.id, formData);
            } else {
                await productService.createProduct(formData);
            }
            setFormData({ name: '', description: '', price: '', stock: '', imageUrl: '' });
            setEditingProduct(null);
            loadProducts();
        } catch (err) {
            setError('Erro ao salvar produto');
        }
    };

    const handleEdit = (product) => {
        setEditingProduct(product);
        setFormData({
            name: product.name,
            description: product.description || '',
            price: product.price,
            stock: product.stock,
            imageUrl: product.imageUrl || ''
        });
    };

    const handleDelete = async (id) => {
        if (window.confirm('Tem certeza que deseja deletar este produto?')) {
            try {
                await productService.deleteProduct(id);
                loadProducts();
            } catch (err) {
                setError('Erro ao deletar produto');
            }
        }
    };

    if (loading) {
        return (
            <div className="loading">
                <div className="spinner"></div>
                <p>Carregando produtos...</p>
            </div>
        );
    }

    return (
        <div>
            <div className="page-header">
                <h2>📦 Gerenciamento de Produtos</h2>
                <p>Cadastre, edite e gerencie todo o catálogo de produtos</p>
            </div>
            
            {error && <div className="alert alert-error">{error}</div>}
            
            <div className="card mb-4">
                <div className="card-header">
                    <h3 className="card-title">
                        {editingProduct ? '✏️ Editar Produto' : '➕ Novo Produto'}
                    </h3>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>📝 Nome do Produto</label>
                        <input
                            type="text"
                            placeholder="Ex: Notebook Dell"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>📄 Descrição</label>
                        <textarea
                            placeholder="Descreva o produto..."
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            rows="3"
                        />
                    </div>
                    <div className="form-group">
                        <label>💰 Preço (R$)</label>
                        <input
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            value={formData.price}
                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>📦 Estoque</label>
                        <input
                            type="number"
                            placeholder="Quantidade disponível"
                            value={formData.stock}
                            onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>🖼️ Categoria</label>
                        <input
                            type="text"
                            placeholder="Ex: Eletrônicos"
                            value={formData.category || ''}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        />
                    </div>
                    <div className="flex gap-2">
                        <button type="submit" className="btn btn-primary flex-1">
                            {editingProduct ? '✅ Atualizar Produto' : '➕ Criar Produto'}
                        </button>
                        {editingProduct && (
                            <button 
                                type="button" 
                                onClick={() => {
                                    setEditingProduct(null);
                                    setFormData({ name: '', description: '', price: '', stock: '', category: '' });
                                }} 
                                className="btn btn-secondary flex-1"
                            >
                                ❌ Cancelar
                            </button>
                        )}
                    </div>
                </form>
            </div>

            <div className="card">
                <div className="card-header">
                    <h3 className="card-title">📋 Lista de Produtos</h3>
                    <span className="badge badge-info">{products.length} produtos</span>
                </div>
                {products.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-state-icon">📦</div>
                        <h3 className="empty-state-title">Nenhum produto cadastrado</h3>
                        <p className="empty-state-description">Comece adicionando um novo produto acima</p>
                    </div>
                ) : (
                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Nome</th>
                                    <th>Descrição</th>
                                    <th>Preço</th>
                                    <th>Estoque</th>
                                    <th>Categoria</th>
                                    <th>Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map(product => (
                                    <tr key={product.id}>
                                        <td>{product.id}</td>
                                        <td>{product.name}</td>
                                        <td>{product.description || '-'}</td>
                                        <td>R$ {parseFloat(product.price).toFixed(2)}</td>
                                        <td>{product.stock}</td>
                                        <td>{product.category || '-'}</td>
                                        <td>
                                            <button 
                                                onClick={() => handleEdit(product)} 
                                                className="btn btn-warning btn-sm"
                                                style={{marginRight: '8px'}}
                                            >
                                                ✏️ Editar
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(product.id)} 
                                                className="btn btn-danger btn-sm"
                                            >
                                                🗑️ Deletar
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ProductsPage;
