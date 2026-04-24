<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Task;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UserTaskSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create a user with name "jone deo" and password "123456"
        $user = User::create([
            'name' => 'jone deo',
            'email' => 'jonedeo@example.com',
            'password' => bcrypt('123456'),
        ]);

        // Create 25 dummy tasks for the user
        $statuses = ['pending', 'completed'];
        $taskTitles = [
            'Complete Project ',
            'Review Code Changes',
            'Fix Bug in Login',
            'Update Database Schema',
            'Write Unit Tests',
            'Optimize Database Queries',
            'Create API Endpoints',
            'Design Database Tables',
            'Set Up CI/CD Pipeline',
            'Configure Server Settings',
            'Implement Authentication',
            'Add User Validation',
            'Create Dashboard UI',
            'Write Integration Tests',
            'Deploy to Production',
            'Monitor Performance',
            'Update Dependencies',
            'Document API Endpoints',
            'Refactor Legacy Code',
            'Set Up Logging',
            'Create Backup Strategy',
            'Implement Caching',
            'Add Email Notifications',
            'Create Admin Panel',
            'Security Audit',
        ];

        $taskDescriptions = [
            'Make sure all features are properly documented',
            'Review and approve all pending code changes',
            'There is an issue with the login page that needs fixing',
            'Update the schema to support new features',
            'Write comprehensive unit tests for the module',
            'Optimize slow queries for better performance',
            'Create new REST API endpoints for mobile app',
            'Design and implement database tables',
            'Set up continuous integration and deployment',
            'Configure server for production environment',
            'Implement user authentication system',
            'Add validation for all user inputs',
            'Create a responsive dashboard interface',
            'Write integration tests for API endpoints',
            'Deploy application to production servers',
            'Monitor and analyze application metrics',
            'Update all package dependencies to latest versions',
            'Document all API endpoints and their usage',
            'Refactor old code to follow new standards',
            'Set up centralized logging system',
            'Create automated backup strategy',
            'Implement Redis caching layer',
            'Add email notification system',
            'Create administrative control panel',
            'Conduct security audit and fix vulnerabilities',
        ];

        foreach (range(1, 25) as $index) {
            Task::create([
                'title' => $taskTitles[$index - 1],
                'description' => $taskDescriptions[$index - 1],
                'status' => $statuses[array_rand($statuses)],
                'user_id' => $user->id,
            ]);
        }
    }
}
