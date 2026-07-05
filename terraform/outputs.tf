output "instance_public_ip" {

  value = aws_instance.food_server.public_ip

}

output "instance_id" {

  value = aws_instance.food_server.id

}