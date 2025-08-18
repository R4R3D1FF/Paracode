-- AlterTable
ALTER TABLE "Problem" ADD COLUMN     "solution_code_cpp" TEXT NOT NULL DEFAULT 'class Solution{
    public:
    bool isPalindrome(string s){
        for (int i = 0; i < s.length(); i++){
            if (s[i] != s[s.length()-1-i])
                return 0;
        }
        return 1;
    }
};';
