import multer from "multer";
import path from "path";


const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, "uploads/"); 
	},
	filename: (req, file, cb) => {
		cb(null, Date.now() + path.extname(file.originalname)); 
	},
});

const upload = multer({ storage });


app.post("/productos", upload.single("imagen"), async (req, res) => {
	try {
		const { nombre, descripcion, precio, stock } = req.body;
		const imagen_url = req.file ? `/uploads/${req.file.filename}` : null;

	
		await db.query(
			"INSERT INTO productos (nombre, descripcion, precio, stock, imagen_url) VALUES (?, ?, ?, ?, ?)",
			[nombre, descripcion, precio, stock, imagen_url]
		);

		res.status(201).json({ message: "Producto creado" });
	} catch (error) {
		res.status(500).json({ error: "Error al crear producto" });
	}
});
