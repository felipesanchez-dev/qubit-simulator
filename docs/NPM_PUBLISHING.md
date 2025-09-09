# 🚀 Pasos para Publicar en NPM

## 📋 **PREPARACIÓN ANTES DE PUBLICAR**

### 1. **Verificar que todo funciona:**
```bash
npm run build
npm run test
```

### 2. **Verificar package.json:**
```bash
npm pack --dry-run
```
Esto te mostrará qué archivos se incluirán en el paquete.

### 3. **Limpiar y compilar:**
```bash
rm -rf dist/
npm run build
```

## 🔐 **CONFIGURACIÓN NPM**

### 1. **Crear cuenta en npmjs.com**
- Ve a https://www.npmjs.com/signup
- Crea tu cuenta

### 2. **Login en terminal:**
```bash
npm login
# Ingresa: username, password, email
```

### 3. **Verificar autenticación:**
```bash
npm whoami
```

## 📦 **PROCESO DE PUBLICACIÓN**

### 1. **Verificar nombre disponible:**
```bash
npm search qubit-simulator
```

### 2. **Publicar versión inicial:**
```bash
npm publish
```

### 3. **Para versiones futuras:**
```bash
# Actualizar versión
npm version patch  # 0.0.1 -> 0.0.2
npm version minor  # 0.0.1 -> 0.1.0  
npm version major  # 0.0.1 -> 1.0.0

# Publicar nueva versión
npm publish
```

## 🎯 **DESPUÉS DE PUBLICAR**

### **Los usuarios podrán instalar:**
```bash
npm install qubit-simulator
```

### **Y usar así:**
```javascript
// CommonJS
const { QKits, Gates } = require('qubit-simulator');

// ES6 Modules  
import { QKits, Gates } from 'qubit-simulator';

// Usar
const qubit = QKits.createQubit();
const hadamard = Gates.H();
```

## ⚠️ **CONSIDERACIONES IMPORTANTES**

### **Versionado Semántico:**
- `0.0.x` - Desarrollo inicial
- `0.1.0` - Primera versión funcional
- `1.0.0` - Primera versión estable
- `1.0.x` - Bug fixes
- `1.x.0` - Nuevas características
- `x.0.0` - Cambios breaking

### **Límites de NPM:**
- Paquete máximo: 100MB
- Tu paquete (~40KB compilado) está perfecto ✅

### **Documentación:**
- README.md se mostrará automáticamente en npmjs.com
- Asegúrate de que esté actualizado
