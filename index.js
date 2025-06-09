import express from 'express';
import expressLayouts from 'express-ejs-layouts';
import methodeOverride from 'method-override';
import path from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config';
import RecruitedUserRoutes from './routes/routes.js';

const PORT = process.env.PORT || 3000;

//---------------------Initialize Express App---------------------//
const app = express();

//---------------------Resolve File Names for ES Modules---------------------- //
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//---------------------Middleware---------------------//
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(expressLayouts);
app.use(methodeOverride('_method'));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('layout', 'layout');

app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/views', express.static(path.join(__dirname, 'views')));

//---------------------Routes---------------------//

app.use('/users', RecruitedUserRoutes);

//-------------------------Start Server-------------------------//
app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
});
