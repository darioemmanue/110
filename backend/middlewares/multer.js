import multer from "multer";
import path from "path";

// Configuración multer para guardar imágenes en 'uploads/'
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, "uploads/"); // carpeta donde guardas imágenes
	},
	filename: (req, file, cb) => {
		cb(null, Date.now() + path.extname(file.originalname)); // nombre único
	},
});

const upload = multer({ storage });

// Ruta para agregar producto con imagen
app.post("/productos", upload.single("imagen"), async (req, res) => {
	try {
		const { nombre, descripcion, precio, stock } = req.body;
		const imagen_url = req.file ? `/uploads/${req.file.filename}` : null;

		// Aquí agregas el producto a la base, ejemplo con pseudo código:
		await db.query(
			"INSERT INTO productos (nombre, descripcion, precio, stock, imagen_url) VALUES (?, ?, ?, ?, ?)",
			[nombre, descripcion, precio, stock, imagen_url]
		);

		res.status(201).json({ message: "Producto creado" });
	} catch (error) {
		res.status(500).json({ error: "Error al crear producto" });
	}
});
