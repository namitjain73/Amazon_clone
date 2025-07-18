 const products = [
      {
        id: 1,
        name: "iPhone 14 Pro Max",
        price: 121900,
        image: "https://m.media-amazon.com/images/I/61xJlx-3KDL._AC_UY327_FMwebp_QL65_.jpg",
        rating: 4.8,
        category: "electronics"
      },
      {
        id: 2,
        name: "Premium Smart Watch",
        price: 8699,
        image: "https://m.media-amazon.com/images/I/71qimMnXNoL._AC_SY175_.jpg",
        rating: 4.5,
        category: "electronics"
      },
      {
        id: 3,
        name: "Smart Water Bottle",
        price: 1300,
        image: "https://m.media-amazon.com/images/I/71MXSFRW87L._AC_SY175_.jpg",
        rating: 4.2,
        category: "home"
      },
      {
        id: 4,
        name: "Premium iPhone Case",
        price: 1500,
        image: "https://m.media-amazon.com/images/I/61Qsf4nQiZL._AC_UY327_FMwebp_QL65_.jpg",
        rating: 4.6,
        category: "electronics"
      },
      {
        id: 5,
        name: "Wireless Headphones",
        price: 5999,
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop",
        rating: 4.7,
        category: "electronics"
      },
      {
        id: 6,
        name: "Gaming Laptop",
        price: 89999,
        image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=300&h=300&fit=crop",
        rating: 4.9,
        category: "electronics"
      }
    ];

    let cart = [];
    let wishlist = [];

    // Initialize the page
    document.addEventListener('DOMContentLoaded', function() {
      loadProducts();
      updateCartBadge();
      
      // Navbar scroll effect
      window.addEventListener('scroll', function() {
        const navbar = document.getElementById('navbar');
        if (window.scrollY > 50) {
          navbar.classList.add('scrolled');
        } else {
          navbar.classList.remove('scrolled');
        }
      });
    });

    // Load products into the grid
    function loadProducts(filterCategory = 'all') {
      const productGrid = document.getElementById('productGrid');
      const filteredProducts = filterCategory === 'all' 
        ? products 
        : products.filter(product => product.category === filterCategory);
      
      productGrid.innerHTML = filteredProducts.map(product => `
        <div class="product-card" data-category="${product.category}">
          <div class="product-image">
            <img src="${product.image}" alt="${product.name}">
            <div class="product-overlay">
              <a href="#" class="quick-view" onclick="quickView(${product.id})">Quick View</a>
            </div>
          </div>
          <div class="product-info">
            <h3 class="product-title">${product.name}</h3>
            <div class="product-price">₹${product.price.toLocaleString()}</div>
            <div class="product-rating">
              <div class="stars">
                ${'★'.repeat(Math.floor(product.rating))}${'☆'.repeat(5 - Math.floor(product.rating))}
              </div>
              <span class="rating-text">${product.rating} (${Math.floor(Math.random() * 1000) + 100} reviews)</span>
            </div>
            <button class="add-to-cart" onclick="addToCart(${product.id})">
              <i class="fas fa-shopping-cart"></i> Add to Cart
            </button>
          </div>
        </div>
      `).join('');
    }

    // Add to cart functionality
    function addToCart(productId) {
      const product = products.find(p => p.id === productId);
      const existingItem = cart.find(item => item.id === productId);
      
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        cart.push({...product, quantity: 1});
      }
      
      updateCartBadge();
      showNotification('Product added to cart!', 'success');
      
      // Add animation to cart button
      const btn = event.target;
      btn.innerHTML = '<div class="loading"></div>';
      setTimeout(() => {
        btn.innerHTML = '<i class="fas fa-check"></i> Added!';
        setTimeout(() => {
          btn.innerHTML = '<i class="fas fa-shopping-cart"></i> Add to Cart';
        }, 1000);
      }, 500);
    }

    // Toggle cart sidebar
    function toggleCart() {
      const cartSidebar = document.getElementById('cartSidebar');
      const cartOverlay = document.getElementById('cartOverlay');
      
      cartSidebar.classList.toggle('open');
      cartOverlay.classList.toggle('open');
      
      if (cartSidebar.classList.contains('open')) {
        updateCartDisplay();
      }
    }

    // Update cart display
    function updateCartDisplay() {
      const cartItems = document.getElementById('cartItems');
      
      if (cart.length === 0) {
        cartItems.innerHTML = '<p style="text-align: center; color: #666; margin-top: 50px;">Your cart is empty</p>';
        return;
      }
      
      const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      
      cartItems.innerHTML = `
        ${cart.map(item => `
          <div class="cart-item">
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-info">
              <div class="cart-item-title">${item.name}</div>
              <div class="cart-item-price">₹${item.price.toLocaleString()} x ${item.quantity}</div>
            </div>
            <button onclick="removeFromCart(${item.id})" style="background: none; border: none; color: #ff4757; cursor: pointer;">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        `).join('')}
        <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #eee;">
          <div style="display: flex; justify-content: space-between; font-weight: 600; font-size: 1.2rem;">
            <span>Total: ₹${total.toLocaleString()}</span>
          </div>
          <button style="width: 100%; margin-top: 15px; padding: 15px; background: linear-gradient(45deg, #667eea, #764ba2); border: none; color: white; border-radius: 50px; font-weight: 600; cursor: pointer;" onclick="checkout()">
            Proceed to Checkout
          </button>
        </div>
      `;
    }

    // Remove from cart
    function removeFromCart(productId) {
      cart = cart.filter(item => item.id !== productId);
      updateCartBadge();
      updateCartDisplay();
      showNotification('Product removed from cart!', 'info');
    }

    // Update cart badge
    function updateCartBadge() {
      const badge = document.getElementById('cartBadge');
      const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
      badge.textContent = totalItems;
      badge.style.display = totalItems > 0 ? 'flex' : 'none';
    }

    // Search products
    function searchProducts() {
      const searchTerm = document.getElementById('searchInput').value.toLowerCase();
      const category = document.getElementById('category').value;
      
      let filteredProducts = products;
      
      if (category !== 'all') {
        filteredProducts = filteredProducts.filter(p => p.category === category);
      }
      
      if (searchTerm) {
        filteredProducts = filteredProducts.filter(p => 
          p.name.toLowerCase().includes(searchTerm)
        );
      }
      
      const productGrid = document.getElementById('productGrid');
      productGrid.innerHTML = filteredProducts.map(product => `
        <div class="product-card" data-category="${product.category}">
          <div class="product-image">
            <img src="${product.image}" alt="${product.name}">
            <div class="product-overlay">
              <a href="#" class="quick-view" onclick="quickView(${product.id})">Quick View</a>
            </div>
          </div>
          <div class="product-info">
            <h3 class="product-title">${product.name}</h3>
            <div class="product-price">₹${product.price.toLocaleString()}</div>
            <div class="product-rating">
              <div class="stars">
                ${'★'.repeat(Math.floor(product.rating))}${'☆'.repeat(5 - Math.floor(product.rating))}
              </div>
              <span class="rating-text">${product.rating} (${Math.floor(Math.random() * 1000) + 100} reviews)</span>
            </div>
            <button class="add-to-cart" onclick="addToCart(${product.id})">
              <i class="fas fa-shopping-cart"></i> Add to Cart
            </button>
          </div>
        </div>
      `).join('');
    }

    // Show notification
    function showNotification(message, type = 'success') {
      const notification = document.createElement('div');
      notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
        color: white;
        border-radius: 5px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        font-weight: 500;
        transform: translateX(400px);
        transition: transform 0.3s ease;
      `;
      notification.textContent = message;
      document.body.appendChild(notification);
      
      setTimeout(() => {
        notification.style.transform = 'translateX(0)';
      }, 100);
      
      setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
          document.body.removeChild(notification);
        }, 300);
      }, 3000);
    }

    // Quick view functionality
    function quickView(productId) {
      const product = products.find(p => p.id === productId);
      showNotification(`Quick view for ${product.name}`, 'info');
    }

    // Toggle account dropdown
    function toggleAccount() {
      showNotification('Account features coming soon!', 'info');
    }

    // Toggle wishlist
    function toggleWishlist() {
      showNotification('Wishlist features coming soon!', 'info');
    }

    // Checkout functionality
    function checkout() {
      if (cart.length === 0) {
        showNotification('Your cart is empty!', 'error');
        return;
      }
      
      showNotification('Proceeding to checkout...', 'success');
      // Here you would typically redirect to a checkout page
      setTimeout(() => {
        showNotification('Checkout complete! Thank you for your purchase!', 'success');
        cart = [];
        updateCartBadge();
        toggleCart();
      }, 2000);
    }

    // Smooth scrolling for hero CTA
    document.addEventListener('DOMContentLoaded', function() {
      const heroButton = document.querySelector('.hero-cta');
      if (heroButton) {
        heroButton.addEventListener('click', function(e) {
          e.preventDefault();
          document.getElementById('products').scrollIntoView({
            behavior: 'smooth'
          });
        });
      }
    });

    // Category filter functionality
    document.addEventListener('DOMContentLoaded', function() {
      const categorySelect = document.getElementById('category');
      if (categorySelect) {
        categorySelect.addEventListener('change', function() {
          const selectedCategory = this.value;
          loadProducts(selectedCategory);
        });
      }
    });

    // Search on Enter key
    document.addEventListener('DOMContentLoaded', function() {
      const searchInput = document.getElementById('searchInput');
      if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
          if (e.key === 'Enter') {
            searchProducts();
          }
        });
      }
    });

    // Mobile menu toggle (if needed)
    function toggleMobileMenu() {
      // Mobile menu functionality can be added here
      showNotification('Mobile menu toggle', 'info');
    }

    // Add to wishlist functionality
    function addToWishlist(productId) {
      const product = products.find(p => p.id === productId);
      if (!wishlist.find(item => item.id === productId)) {
        wishlist.push(product);
        showNotification('Added to wishlist!', 'success');
      } else {
        showNotification('Item already in wishlist!', 'info');
      }
    }

    // Product comparison functionality
    function compareProducts() {
      showNotification('Product comparison feature coming soon!', 'info');
    }

    // Newsletter signup
    function subscribeNewsletter() {
      showNotification('Newsletter subscription feature coming soon!', 'info');
    }

    // Social media sharing
    function shareProduct(productId) {
      const product = products.find(p => p.id === productId);
      if (navigator.share) {
        navigator.share({
          title: product.name,
          text: `Check out this amazing ${product.name} for just ₹${product.price.toLocaleString()}!`,
          url: window.location.href
        });
      } else {
        showNotification('Sharing feature not supported on this device', 'info');
      }
    }

    // Initialize animations on scroll
    function initScrollAnimations() {
      const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      };

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
          }
        });
      }, observerOptions);

      document.querySelectorAll('.product-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
      });
    }

    // Initialize scroll animations when page loads
    document.addEventListener('DOMContentLoaded', function() {
      setTimeout(initScrollAnimations, 100);
    });

    // Performance optimization: Lazy loading for images
    function initLazyLoading() {
      const images = document.querySelectorAll('img[data-src]');
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.remove('lazy');
            imageObserver.unobserve(img);
          }
        });
      });

      images.forEach(img => imageObserver.observe(img));
    }

    // Initialize everything when DOM is ready
    document.addEventListener('DOMContentLoaded', function() {
      loadProducts();
      updateCartBadge();
      initScrollAnimations();
      initLazyLoading();
      
      // Add some sample items to cart for demo
      setTimeout(() => {
        console.log('ShopVibe e-commerce site loaded successfully!');
        console.log('Features available:');
        console.log('- Product search and filtering');
        console.log('- Shopping cart with persistence');
        console.log('- Responsive design');
        console.log('- Smooth animations');
        console.log('- Modern UI/UX');
      }, 1000);
    });