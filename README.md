# Todo App (React + Spring Boot + JWT)

## Giới thiệu

Đây là một ứng dụng quản lý công việc (Todo App) được xây dựng bằng:

Frontend: React
Backend: Spring Boot
Authentication: JWT (JSON Web Token)

Dự án được thực hiện với mục tiêu học tập, luyện tập xây dựng RESTful API, xác thực người dùng và phân quyền trong hệ thống fullstack.

## Tính năng chính

### Xác thực & Phân quyền

- Đăng ký tài khoản (Register)
- Đăng nhập (Login)
- Xác thực bằng JWT
- Phân quyền theo vai trò (User / Admin)

### Quản lý công việc (Todo)

- Tạo công việc mới
- Xem danh sách công việc
- Xem chi tiết công việc
- Cập nhật công việc
- Xóa công việc
- Đánh dấu hoàn thành / chưa hoàn thành

### Admin Dashboard

- Xem danh sách người dùng
- Cấp quyền Admin cho user
- Xóa người dùng

### Quản lý người dùng

- Xem thông tin cá nhân
- Đổi mật khẩu
- Xóa tài khoản

## Công nghệ sử dụng

### Backend

- Java Spring Boot
- Spring Security
- JWT (JSON Web Token)
- JPA / Hibernate
- MySQL

### Frontend

- ReactJS
- Axios
- React Router

## API

### Auth

- POST /api/auth/login 
- POST /api/auth/register

### Todo

- GET /api/todos 
- GET /api/todos/{id}
- POST /api/todos 
- PATCH /api/todos/{id} 
- DELETE /api/todos/{id}
- PUT /api/toggleComplete/{id}

### Admin

- GET /api/admin 
- PUT /api/admin/promoted/{id} 
- DELETE /api/admin/{id}

### User

- GET /api/users/info 
- PUT /api/users/pasword 
- DELETE /api/users

## Security
Tất cả các request cần xác thực sẽ sử dụng JWT trong header:
- Authorization: Bearer `<token>`

## Demo

### Auth

<p align="left">
  <img src="screenshots/login.png" width="30%" />
  <img src="screenshots/register.png" width="30%" />
</p>

### Todo

<p align="left">
  <img src="screenshots/homepage.png" width="30%" />
  <img src="screenshots/newtodo.png" width="30%" />
  <img src="screenshots/tododetail.png" width="30%" />
</p>

### Admin Dashboard

<p align="left">
  <img src="screenshots/admindashboard.png" width="30%" />
</p>

### User

<p align="left">
  <img src="screenshots/userprofile.png" width="30%" />
</p>

## Author

### Phạm Hoàn

- Email: hoanpham2911@gmail.com
- Github: https://github.com/Hoanpham29
