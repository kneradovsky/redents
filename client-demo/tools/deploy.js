import config from '../webpack.config.prod';
import cardServicesServer from '../cardservicesServer';
import colors from 'colors';
import fs from 'fs';

[config.output.filename,config.output.filename+".map",'styles.css'].every((it,ind,arr)=> {
	fs.createReadStream(`${config.output.path}/${it}`).pipe(fs.createWriteStream(`${cardServicesServer.jsPath}/${it}`));	
	console.log(`Bundle chunk copied to ${cardServicesServer.jsPath}/${it}`.green);
	return true;
});

