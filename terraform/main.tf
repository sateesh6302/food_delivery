resource "aws_vpc" "food_vpc" {
  cidr_block = "10.0.0.0/16"

  tags = {
    Name = "FoodDeliveryVPC"
  }
}

resource "aws_subnet" "public_subnet" {
  vpc_id = aws_vpc.food_vpc.id
  cidr_block = "10.0.1.0/24"

  map_public_ip_on_launch = true

  availability_zone = "eu-north-1a"

  tags = {
    Name = "PublicSubnet"
  }
}

resource "aws_internet_gateway" "igw" {
  vpc_id = aws_vpc.food_vpc.id

  tags = {
    Name = "FoodIGW"
  }
}

resource "aws_route_table" "public_rt" {
  vpc_id = aws_vpc.food_vpc.id

  route {
    cidr_block = "0.0.0.0/0"

    gateway_id = aws_internet_gateway.igw.id
  }
}

resource "aws_route_table_association" "association" {
  subnet_id = aws_subnet.public_subnet.id

  route_table_id = aws_route_table.public_rt.id
}

resource "aws_security_group" "food_sg" {

  name = "food-security-group"

  vpc_id = aws_vpc.food_vpc.id

  ingress {

    from_port = 22

    to_port = 22

    protocol = "tcp"

    cidr_blocks = ["0.0.0.0/0"]

  }

  ingress {

    from_port = 80

    to_port = 80

    protocol = "tcp"

    cidr_blocks = ["0.0.0.0/0"]

  }

  ingress {

    from_port = 4000

    to_port = 4000

    protocol = "tcp"

    cidr_blocks = ["0.0.0.0/0"]

  }

  ingress {

    from_port = 5173

    to_port = 5173

    protocol = "tcp"

    cidr_blocks = ["0.0.0.0/0"]

  }

  egress {

    from_port = 0

    to_port = 0

    protocol = "-1"

    cidr_blocks = ["0.0.0.0/0"]

  }

}

resource "aws_instance" "food_server" {

  ami = "ami-0402e980e69d5978b"

  instance_type = "t3.micro"

  subnet_id = aws_subnet.public_subnet.id

  vpc_security_group_ids = [aws_security_group.food_sg.id]

  key_name = "mykey"

  tags = {

    Name = "FoodDeliveryServer"

  }

}