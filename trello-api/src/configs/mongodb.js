import { MongoClient, ServerApiVersion } from 'mongodb';
import { DATABASE_NAME, MONGODB_URI } from './constants';

// Khởi tạo một đối tượng để lưu trữ instance của database, ban đầu là null (vì chưa connect)
let trelloDbInstance = null;

// Khởi tạo một đối tượng Client Instance để connect tới MongoDB
const mongoClientInstance = new MongoClient(MONGODB_URI, {
  // Lưu ý: cái serverAPi có từ phiên bản 5.0 trở lên, có thể không cần thiết, còn nếu dùng nó thì ta sẽ chỉ định một cái Stable API version của mongo đb
  // Đọc thêm tại: https://www.mongodb.com/docs/drivers/node/current/fundamentals/stable-api/
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true
  }
});


export const CONNECT_DB = async () => {
  // Gọi kết nối tới mongodb với uri đã được cung cấp trong thân gàm mongoClientInstance
  await mongoClientInstance.connect();

  // Kết nối thành công thì lất ra database theo tên và gán ngược nó lại vào biết trelloDbInstance
  trelloDbInstance = mongoClientInstance.db(DATABASE_NAME);
}

/**
 *  Trả về một instance của database
 * @returns {import('mongodb').Db}
 */
export const GET_DB = () => {
  if (!trelloDbInstance) {
    throw new Error('You must connect to the database first');
  }
  return trelloDbInstance;

}