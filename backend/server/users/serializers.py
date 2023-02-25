from rest_framework import serializers

from .models import User

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers
from .models import User

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        data['username'] = self.user.username
        data['user_id'] = self.user.id
        data['full_name'] = self.user.get_full_name()
        return data
    
class UserSerializer(serializers.ModelSerializer):
    password2 = serializers.CharField(style={'input_type': 'password'}, write_only=True)

    class Meta:
        model = User
        fields = [
            'id', 
            'email', 
            'first_name', 
            'last_name', 
            'username',
            'password',
            'password2',
            'is_active', 
            'date_joined'
        ]
        extra_kwargs = {
            'password': {'write_only': True}
        }
    
    def save(self):
        user = User(
            email=self.validated_data['email'],
            first_name=self.validated_data['first_name'],
            last_name=self.validated_data['last_name'],
            username=self.validated_data['username']
        )
        password = self.validated_data['password']
        password2 = self.validated_data['password2']

        if password != password2:
            raise serializers.ValidationError({'password': 'Passwords must match'})

        user.set_password(password)
        user.save()

        return user