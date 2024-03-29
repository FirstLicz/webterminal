# Generated by Django 3.2.6 on 2021-11-15 05:42

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('terminal', '0006_screenrecord_protocol'),
    ]

    operations = [
        migrations.AlterField(
            model_name='connections',
            name='protocol_type',
            field=models.CharField(choices=[('SSH2', 'ssh2'), ('RDP', 'rdp'), ('VNC', 'vnc'), ('TELNET', 'telnet')], default='SSH2', max_length=6, verbose_name='协议类型'),
        ),
        migrations.AlterField(
            model_name='screenrecord',
            name='protocol',
            field=models.CharField(blank=True, choices=[('ssh2', 'ssh2'), ('rdp', 'windows rdp'), ('telnet', 'telnet'), ('ssh', 'ssh'), ('vnc', 'vnc')], default='ssh2', max_length=10, null=True, verbose_name='协议类别'),
        ),
    ]
